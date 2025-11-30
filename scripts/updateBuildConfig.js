const path = require("path");
const fs = require("fs");

/**
 * How to use:
 * 
 * From the command line run the following:
 * node ./scripts/updateBuildConfig.js versionType
 * versionType can be either "major", "minor", "patch", or "prerelease"
 * When prerelease the second argument is the prerelease id (alpha, beta, rc). keep empty to keep the same one.
 * 
 * This will be triggered by the CI when running the right pipeline (publish minor, publish major, publish patch)
 * 
 * Commit the file change afterwards and submit a pull request to first allow the tests to run.
 */


const config = require(path.resolve("./.build/config.json"));
const updateType = process.argv[2] || "minor";
const preid = process.argv[3] || config.preid;

config.versionDefinition = updateType;
config.nonce++;
config.preid = preid;

fs.writeFileSync(path.resolve("./.build/config.json"), JSON.stringify(config, null, 2));
export const commentSlice = createSlice({
    name: 'commentState',
    initialState: initialState as CommentState,
    reducers: {
        afterAddCommentToDoc(
            state,
            action: PayloadAction<{ filePath: string; functionName: string }>
        ) {
            const commentFn =
                state.fileThenNames[action.payload.filePath][
                    action.payload.functionName
                ]
            if (commentFn == null) return
            commentFn.marked = true
        },
        updateComments(
            state,
            action: PayloadAction<{
                filePath: string
                comments: { [key: string]: CommentFunction }
            }>
        ) {
            state.fileThenNames[action.payload.filePath] =
                action.payload.comments
        },
        updateSingleComment(
            state,
            action: PayloadAction<{
                filePath: string
                functionName: string
                commentFn: CommentFunction
            }>
        ) {
            if (state.fileThenNames[action.payload.filePath] == null) {
                state.fileThenNames[action.payload.filePath] = {}
            }
            state.fileThenNames[action.payload.filePath][
                action.payload.functionName
            ] = action.payload.commentFn
        },
    },
})

export const { updateComments, updateSingleComment, afterAddCommentToDoc } =
    commentSlice.act
