namespace phasereditor2d.scene.core {

    export class RawCode extends CodeDOM {

        private _code: string;

        constructor(code: string) {
            super();

            this._code = code;
        }

        getCode() {
            return this._code;
        }
    }
}