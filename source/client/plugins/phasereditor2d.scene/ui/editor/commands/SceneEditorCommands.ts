namespace phasereditor2d.scene.ui.editor.commands {

    export const CMD_JOIN_IN_CONTAINER = "phasereditor2d.scene.ui.editor.commands.JoinInContainer";
    export const CMD_OPEN_COMPILED_FILE = "phasereditor2d.scene.ui.editor.commands.OpenCompiledFile";
    export const CMD_COMPILE_SCENE_EDITOR = "phasereditor2d.scene.ui.editor.commands.CompileSceneEditor";
    export const CMD_COMPILE_ALL_SCENE_FILES = "phasereditor2d.scene.ui.editor.commands.CompileAllSceneFiles";

    function isSceneScope(args: colibri.ui.ide.commands.CommandArgs) {
        return args.activePart instanceof SceneEditor ||
            args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView
            && args.activeEditor instanceof SceneEditor;
    }

    export class SceneEditorCommands {

        static registerCommands(manager: colibri.ui.ide.commands.CommandManager) {

            // update current editor

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_UPDATE_CURRENT_EDITOR,
                args => args.activeEditor instanceof SceneEditor,
                args => (args.activeEditor as SceneEditor).refreshScene());

            // select all

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_SELECT_ALL,

                args => args.activePart instanceof SceneEditor,

                args => {
                    const editor = args.activeEditor as SceneEditor;
                    editor.getSelectionManager().selectAll();
                });

            // clear selection

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_ESCAPE,

                isSceneScope,

                args => {
                    const editor = args.activeEditor as SceneEditor;
                    editor.getSelectionManager().clearSelection();
                });

            // delete

            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE,

                isSceneScope,

                args => {
                    const editor = args.activeEditor as SceneEditor;
                    editor.getActionManager().deleteObjects();
                });

            // join in container

            manager.addCommandHelper({
                id: CMD_JOIN_IN_CONTAINER,
                name: "Join Objects",
                tooltip: "Create a container with the selected objects"
            });

            manager.addHandlerHelper(CMD_JOIN_IN_CONTAINER,

                args => isSceneScope(args),

                args => {
                    const editor = args.activeEditor as SceneEditor;
                    editor.getActionManager().joinObjectsInContainer();
                });

            manager.addKeyBinding(CMD_JOIN_IN_CONTAINER, new colibri.ui.ide.commands.KeyMatcher({
                key: "j"
            }));

            // open compiled file

            manager.addCommandHelper({
                id: CMD_OPEN_COMPILED_FILE,
                icon: webContentTypes.WebContentTypesPlugin.getInstance().getIcon(webContentTypes.ICON_FILE_SCRIPT),
                name: "Open Scene Output File",
                tooltip: "Open the output source file of the scene."
            });

            manager.addHandlerHelper(
                CMD_OPEN_COMPILED_FILE,
                args => args.activeEditor instanceof SceneEditor,
                args => (args.activeEditor as SceneEditor).openSourceFileInEditor());

            // compile scene editor

            manager.addCommandHelper({
                id: CMD_COMPILE_SCENE_EDITOR,
                icon: ScenePlugin.getInstance().getIcon(ICON_BUILD),
                name: "Compile Scene",
                tooltip: "Compile the editor's Scene."
            });

            manager.addHandlerHelper(
                CMD_COMPILE_SCENE_EDITOR,
                args => args.activeEditor instanceof SceneEditor,
                args => (args.activeEditor as SceneEditor).compile());

            // compile all scene files

            manager.addCommandHelper({
                id: CMD_COMPILE_ALL_SCENE_FILES,
                icon: ScenePlugin.getInstance().getIcon(ICON_BUILD),
                name: "Compile All Scene Files",
                tooltip: "Compile all the Scene files of the project."
            });

            manager.addHandlerHelper(
                CMD_COMPILE_ALL_SCENE_FILES,
                args => args.activeWindow instanceof ide.ui.DesignWindow,
                args => ScenePlugin.getInstance().compileAll());
        }

    }

}