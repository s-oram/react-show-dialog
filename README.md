# React Show Dialog

Application flows involving modal dialogs can be challenging to build well in
React. This library is an attempt to change that.

Modal dialogs are often shown in response to user interactions. For example: the
user presses a "Delete project" button. We then show a "Are you sure?" dialog to
confirm the user does in fact want to delete their project.

This sequence is trivial to write in an imperative style. One thing leads to the
next. However React code is best written in a declarative style, and in my
experience it's non-obvious how to do this whilst keeping the code reusable and
readable.

## Using

Using `react-show-dialog` is a three step process. See
[react-show-dialog-examples](https://github.com/s-oram/react-show-dialog-examples)
for a working example.

### 1. Create your dialog component

The dialog component is a typical React component. It must have a
`onModalResult` property that is called to return the result value.

The dialog component will close automatically after a result is returned.

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

The `showDialog()` function accepts three arguments.

- The dialog React component created at step #1.
- A callback function to handle to the modal result
- A props object that will be provided to the dialog component.

```tsx
import { useShowDialog } from '@s-oram/react-show-dialog'
import { ConfirmDialog } from './ConfirmDialog'
import { deleteProject } from './api'

export const ProjectSettings ({ projectId }: { projectId: string }) => {

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
          showDialog(ConfirmDialog, handleResult, { message: 'Are you sure?'})
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
solution. It will also work with prebuilt dialog components found in UI
component libraries.
