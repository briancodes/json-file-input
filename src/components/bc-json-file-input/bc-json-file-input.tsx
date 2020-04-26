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
import { processJsonFiles } from "../../utils/utils";

/* 
    Notes:
    @see https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
*/

export interface IPreviewData {
    fileName: string;
    content: string;
    error: boolean;
    isLoading?: boolean;
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

    @Prop() multiple: boolean = false;

    @State() files: File[];

    @State() previewList: ReadonlyArray<IPreviewData>;

    @Event() filesLoaded: EventEmitter<File[]>;

    @Event() filesRead: EventEmitter<IPreviewData[]>;

    private inputElement: HTMLInputElement;

    handleButtonClick = () => {
        this.inputElement.click();
    };

    handleInputChange = () => {
        const fileList: FileList = this.inputElement.files;
        if (!fileList || !fileList.length) return;
        this.files = Array.from(fileList);
        this.filesLoaded.emit(this.files);

        processJsonFiles(this.files).then((result) => {
            this.previewList = result;
            this.filesRead.emit(result);
        });
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
                    multiple={this.multiple}
                    ref={(el) => {
                        this.inputElement = el;
                    }}
                    onChange={this.handleInputChange}
                />
                {this.previewJson && this.files && this.previewList && (
                    <bc-json-preview
                        previewList={this.previewList}
                        objectToConsole={this.objectToConsole}
                    ></bc-json-preview>
                )}
            </Host>
        );
    }
}
