import {
    Component,
    ComponentInterface,
    h,
    Host,
    Prop,
    Watch,
} from "@stencil/core";
import { IPreviewData } from "../bc-json-file-input/bc-json-file-input";

/*
    Notes:
    https://stenciljs.com/docs/component-lifecycle#componentwillload-
    https://developer.mozilla.org/en-US/docs/Web/API/FileReader/loadend_event
    https://stenciljs.com/docs/templating-jsx#loops
*/

@Component({
    tag: "bc-json-preview",
    styleUrl: "bc-json-preview.css",
    shadow: true,
})
export class BcJsonPreview implements ComponentInterface {
    @Prop() previewList: ReadonlyArray<IPreviewData>;

    @Prop() objectToConsole: boolean = false;

    // Note: not called on first init+render
    // Use in conjuction with componentWillLoad
    @Watch("previewList")
    previewListChanged() {
        this.logToConsole();
    }

    // Similar to Angular's ngOnInit, called once on first init
    componentWillLoad() {
        this.logToConsole();
    }

    private logToConsole() {
        if (this.previewList && this.objectToConsole) {
            this.previewList.forEach((item) => {
                try {
                    const obj = JSON.parse(item.content);
                    console.log(obj);
                } catch (err) {
                    console.warn("Problem parsing " + item.fileName, err);
                }
            });
        }
    }

    render() {
        return (
            <Host>
                {this.previewList && (
                    <div class="preview-container">
                        {this.previewList.map((data) => {
                            return (
                                <details open={false}>
                                    <summary class={{ error: data.error }}>
                                        {data.fileName}
                                    </summary>
                                    <div class="preview-pane">
                                        {data.content || ""}
                                    </div>
                                </details>
                            );
                        })}
                    </div>
                )}
            </Host>
        );
    }
}
