# bc-json-file-input



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute      | Description | Type      | Default |
| ----------------- | -------------- | ----------- | --------- | ------- |
| `objectToConsole` | `console-log`  |             | `boolean` | `false` |
| `previewJson`     | `preview-json` |             | `boolean` | `false` |


## Events

| Event        | Description | Type                       |
| ------------ | ----------- | -------------------------- |
| `jsonLoaded` |             | `CustomEvent<IFileDetail>` |


## Dependencies

### Depends on

- [bc-json-preview](../bc-json-preview)

### Graph
```mermaid
graph TD;
  bc-json-file-input --> bc-json-preview
  style bc-json-file-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
