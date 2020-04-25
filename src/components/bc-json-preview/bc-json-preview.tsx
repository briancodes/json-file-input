import {
    Component,
    ComponentInterface,
    h,
    Host,
    Prop,
    Watch,
} from "@stencil/core";
import { IFileDetail } from "../bc-json-file-input/bc-json-file-input";

@Component({
    tag: "bc-json-preview",
    styleUrl: "bc-json-preview.css",
    shadow: true,
})
export class BcJsonPreview implements ComponentInterface {
    @Prop() jsonFileDetails: IFileDetail;

    @Prop() objectToConsole: boolean = false;

    @Watch("jsonFileDetails")
    fileDetailsChanged(newValue: IFileDetail) {
        if (this.objectToConsole && newValue) {
            console.log(JSON.parse(newValue.json));
        }
    }

    render() {
        return (
            <Host>
                {this.jsonFileDetails && (
                    <div class="preview-container">
                        <div class="file-name">
                            {this.jsonFileDetails?.fileName}
                        </div>
                        <div class="preview-pane">
                            {this.jsonFileDetails?.json}
                        </div>
                    </div>
                )}
            </Host>
        );
    }
}
