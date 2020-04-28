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
import { JsonFileProcessor } from "../../utils/utils";

/* 
    Notes:
    
    React event handlers
    - https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers

    5 Ways to Style React Components in 2020
    - https://blog.bitsrc.io/5-ways-to-style-react-components-in-2019-30f1ccc2b5b

    Stencil Styling Shadowed DOM
    - https://medium.com/stencil-tricks/a-practical-introduction-to-styling-a-shadow-dom-and-slots-879565a2f423
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

    /**
     * Event emitted when files have been loaded
     *
     * @type {EventEmitter<File[]>}
     * @memberof BcJsonFileInput
     */
    @Event() filesLoaded: EventEmitter<File[]>;

    /**
     * Event emitted when files have been read (using FileReader)
     *
     * @type {EventEmitter<IPreviewData[]>}
     * @memberof BcJsonFileInput
     */
    @Event() filesRead: EventEmitter<ReadonlyArray<IPreviewData>>;

    private inputElement: HTMLInputElement;

    handleButtonClick = () => {
        this.inputElement.click();
    };

    handleInputChange = () => {
        const fileList: FileList = this.inputElement.files;
        if (!fileList || !fileList.length) return;
        this.files = Array.from(fileList);
        this.filesLoaded.emit(this.files);

        const fileProcessor = new JsonFileProcessor();
        fileProcessor.process(this.files).then((result) => {
            this.previewList = result;
            this.filesRead.emit(result);
        });
    };

    render() {
        return (
            <Host>
                <div class="click-container" onClick={this.handleButtonClick}>
                    <slot>
                        <button>Upload File</button>
                    </slot>
                </div>
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
