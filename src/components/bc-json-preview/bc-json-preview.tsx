import { Component, ComponentInterface, h, Prop, Watch } from "@stencil/core";

@Component({
    tag: "bc-json-preview",
    styleUrl: "bc-json-preview.css",
    shadow: true,
})
export class BcJsonPreview implements ComponentInterface {
    @Prop() jsonString: string;

    @Prop() objectToConsole: boolean = false;

    @Watch("jsonString")
    private jsonStringChanged(newValue: string, oldValue: string) {
        if (this.objectToConsole && newValue) {
            console.log(JSON.parse(newValue));
        }
    }

    render() {
        return <div class="preview-pane">{this.jsonString}</div>;
    }
}
