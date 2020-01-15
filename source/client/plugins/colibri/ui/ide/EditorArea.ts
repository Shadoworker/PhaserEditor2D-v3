/// <reference path="./Part.ts"/>
/// <reference path="./EditorPart.ts"/>
/// <reference path="./PartFolder.ts"/>

namespace colibri.ui.ide {

    export class EditorArea extends PartFolder {

        private _tabsToBeClosed: Set<HTMLElement>;

        constructor() {
            super("EditorArea");
        }

        activateEditor(editor: EditorPart): void {
            super.selectTabWithContent(editor);
        }

        getEditors(): EditorPart[] {
            return super.getParts() as EditorPart[];
        }

        getSelectedEditor(): EditorPart {
            return this.getSelectedTabContent() as EditorPart;
        }

        fillTabMenu(menu: controls.Menu, labelElement: HTMLElement) {

            if (this.isSelectedLabel(labelElement)) {

                const editor = this.getSelectedEditor();

                if (editor.isDirty()) {

                    menu.addCommand(colibri.ui.ide.actions.CMD_SAVE);
                    menu.addSeparator();
                }
            }

            menu.add(new controls.Action({
                commandId: actions.CMD_EDITOR_CLOSE,
                text: "Close",
                callback: () => {
                    this.closeTabLabel(labelElement);
                }
            }));

            menu.add(new controls.Action({
                text: "Close Others",
                callback: () => {

                    const selectedEditor = controls.TabPane.getContentFromLabel(labelElement) as EditorPart;

                    if (!selectedEditor) {
                        return;
                    }

                    const editors = this.getEditors();

                    for (const editor of editors) {

                        if (editor !== selectedEditor) {
                            this.closeTab(editor);
                        }
                    }
                }
            }));

            menu.add(new controls.Action({
                text: "Close to the Left",
                callback: () => {

                    const editor = controls.TabPane.getContentFromLabel(labelElement) as EditorPart;

                    if (!editor) {
                        return;
                    }

                    const editors = this.getEditors();
                    const index = this.getEditors().indexOf(editor);

                    for (let i = 0; i < index; i++) {
                        this.closeTab(editors[i]);
                    }
                }
            }));

            menu.add(new controls.Action({
                text: "Close to the right Right",
                callback: () => {

                    const editor = controls.TabPane.getContentFromLabel(labelElement) as EditorPart;

                    if (!editor) {
                        return;
                    }

                    const editors = this.getEditors();
                    const index = this.getEditors().indexOf(editor);

                    for (let i = index + 1; i < editors.length; i++) {
                        this.closeTab(editors[i]);
                    }
                }
            }));

            menu.add(new controls.Action({
                text: "Close Saved",
                callback: () => {

                    for (const editor of this.getEditors()) {

                        if (!editor.isDirty()) {
                            this.closeTab(editor);
                        }
                    }
                }
            }));

            menu.addCommand(actions.CMD_EDITOR_CLOSE_ALL, {
                text: "Close All"
            });

            menu.addSeparator();

            menu.addCommand(ide.actions.CMD_EDITOR_TABS_SIZE_UP);

            menu.addCommand(ide.actions.CMD_EDITOR_TABS_SIZE_DOWN);
        }

        closeAllEditors() {

            for (const editor of this.getEditors()) {
                this.closeTab(editor);
            }
        }

        closeEditors(editors: EditorPart[]) {

            this._tabsToBeClosed = new Set(
                editors.map(editor => this.getLabelFromContent(editor)));

            for (const editor of editors) {

                this.closeTab(editor);
            }

            this._tabsToBeClosed = null;
        }

        selectTab(label: HTMLElement) {

            if (this._tabsToBeClosed) {

                if (this._tabsToBeClosed.has(label)) {

                    return;
                }
            }

            super.selectTab(label);
        }
    }
}