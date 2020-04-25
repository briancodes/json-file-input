import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  h,
  Host,
} from "@stencil/core";

const FILE_TYPE = "application/json";

@Component({
  tag: "bc-json-file-input",
  styleUrl: "bc-json-file-input.css",
  shadow: true,
})
export class BcJsonFileInput implements ComponentInterface {
  // @see https://stenciljs.com/docs/events#event-decorator
  /**
   * Emits the parsed contents of the JSON file
   *
   * @type {EventEmitter<any>}
   * @memberof BcJsonFileInput
   */
  @Event() jsonParsed: EventEmitter<any>;

  private inputElement: HTMLInputElement;

  // @see https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
  handleButtonClick = (event: MouseEvent) => {
    console.log(event, "inupt element: ", this.inputElement);
    this.inputElement.click();
  };

  handleInputChange = () => {
    console.log("handle input change");
    const file = this.inputElement.files[0] as File;
    if (!file || file.type !== FILE_TYPE) {
      console.warn("JSON file type only");
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      const json = ev.target.result as string;
      const parsed = JSON.parse(json);
      console.log("Input loaded");
      this.jsonParsed.emit(parsed);
    });
    reader.readAsText(file);
  };

  render() {
    return (
      <Host>
        <button class="upload-button" onClick={this.handleButtonClick}>
          <slot name="button-text">Upload File</slot>
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
      </Host>
    );
  }
}
