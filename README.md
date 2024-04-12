# React Show Dialog

A headless library to help build application flows involving modal dialogs.

## Using

Using `react-show-dialog` is a three step process. See
[react-show-dialog-examples](https://github.com/s-oram/react-show-dialog-examples)
for a working example.

### 1. Create your dialog component

The dialog component is a typical React component. It must have a
`onModalResult` property that is called to return the result value.

```tsx
import { type RequiredDialogProps } from '@s-oram/react-show-dialog'

export const ConfirmDialog = ({
  message,
  onModalResult,
}: { message: string } & RequiredDialogProps) => {
  return (
    <div>
      <p>{message}</p>
      <button onClick={() => onModalResult('OK')}>OK</button>
      <button onClick={() => onModalResult('Cancel')}>Cancel</button>
    </div>
  )
}
```

### 2. Activate the dialog with the `useShowDialog()` hook

The `useShowDialog()` hook returns a `showDialog()` function that can be called
to activate your dialog.

```tsx
import { useShowDialog } from '@s-oram/react-show-dialog'
import { ConfirmDialog } from './ConfirmDialog'
import { deleteProject } from './api'

export const ProjectSettings () => {

  const showDialog = useShowDialog()

  const handleResult = (modalResult: string) => {
    if (modalResult === 'OK') {
        deleteProject()
    }
  }

  return (
    <div>
      <h1>Project Settings</h1>
      <button
        onClick={() => {
          showDialog(ConfirmDialog, handleResult)
        }}
      >
        Delete project
      </button>
    </div>
  )
}
```

### 3. Add the `<ShowDialogProvider>` component to your application

Finally we need to add the `<ShowDialogProvider/>` somewhere in the application
component tree.

```tsx
import { ShowDialogProvider } from '@s-oram/react-show-dialog'
import { ProjectSettings } from './ProjectSettings'

export default function App() {
  return (
    <ShowDialogProvider>
      <ProjectSettings />
    </ShowDialogProvider>
  )
}
```

## Styling

Show Dialog is a headless UI library. It works equally well with any styling
solution and all component libraries.
