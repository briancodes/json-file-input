import {
    Component,
    ComponentInterface,
    Event,
    EventEmitter,
    h,
    Host,
    Prop,
    State,
} from "@stencil/core";

/* 
    Notes:
    @see https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
*/

const FILE_TYPE = "application/json";

export interface IFileDetail {
    fileName: string;
    json: string;
}

@Component({
    tag: "bc-json-file-input",
    styleUrl: "bc-json-file-input.css",
    shadow: true,
})
export class BcJsonFileInput implements ComponentInterface {
    @Prop() previewJson: boolean = false;

    @Prop({
        attribute: "console-log",
    })
    objectToConsole: boolean = false;

    @State() jsonFileDetails: IFileDetail;

    @Event() jsonLoaded: EventEmitter<IFileDetail>;

    private inputElement: HTMLInputElement;

    handleButtonClick = () => {
        this.inputElement.click();
    };

    handleInputChange = () => {
        const file = this.inputElement.files[0] as File;
        if (!file || file.type !== FILE_TYPE) {
            return;
        }
        const reader = new FileReader();
        reader.addEventListener("load", (ev) => {
            const json = ev.target.result as string;
            this.jsonFileDetails = {
                fileName: file.name,
                json,
            };
            this.jsonLoaded.emit(this.jsonFileDetails);
        });
        reader.readAsText(file);
    };

    render() {
        return (
            <Host>
                <button class="upload-button" onClick={this.handleButtonClick}>
                    <slot>
                        <span>Upload File</span>
                    </slot>
                </button>
                <input
                    class="file-input"
                    type="file"
                    accept=".json"
                    ref={(el) => {
                        this.inputElement = el;
                    }}
                    onChange={this.handleInputChange}
                />
                {this.previewJson && (
                    <bc-json-preview
                        jsonFileDetails={this.jsonFileDetails}
                        objectToConsole={this.objectToConsole}
                    ></bc-json-preview>
                )}
            </Host>
        );
    }
}
