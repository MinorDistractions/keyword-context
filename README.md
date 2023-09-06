# Keyword Context

A Visual Studio Code extension that provides user-supplied hover context for keywords detected in the editor. Once defined in settings.json, a tooltip will appear over keywords displaying the supplied message.

## Use cases

- You've inherited a code base full of poorly named functions and variables and are unable to change them. Using Keyword Context you can add your own notes or definitions which will appear when you hover
- You use long IDs with special meanings and want to add context to avoid manually looking them up
- You're learning to code in a new language and want to add notes to keywords

## Usage

Once installed in Visual Studio Code, add your keywords and the associated tooltip messages to settings.json:

```json
[
    {
        "keyword": "some_badly_named_variable",
        "tooltip": "This variable is used for..."
    },
    {
        "keyword": "some_badly_named_function",
        "tooltip": "This function does..."
    },
    {
        "keyword": "ID_234873",
        "tooltip": "This ID refers to..."
    },
    ...
]
```

## Settings

| Settings                         | Default      | Description                                                                                                                                                                                 |
| -------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| keyword-context.map              | `[...,...]`  | Array of Context objects, each Context must contain the keys "keyword" and "tooltip". The value given to "tooltip" will appear when the value of "keyword" is hovered over in the editor    |
| keyword-context.source-toggle    | `False`      | Setting to control if the extension source "Keyword Context" is shown after the tooltip.                                                                                                    |

Icon created by Smashicons