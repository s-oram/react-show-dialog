# Show Dialog

Application flows involving modal dialogs can be challenging to build well in
React. This library is an attempt to change that.

Modal dialogs are often shown in response to user interactions. For example: the
user presses a "Delete project" button. We then show a "Are you sure?" dialog to
confirm the user does in fact want to delete their project.

This sequence is trivial to write in an imperative style. One thing leads to the
next. However React code is best written in a declarative style, and in my
experience it's non-obvious how to do this whilst keeping the code reusable and
readable.

## Using Show Dialog

First we need to write a modal dialog component:

```tsx
import { type RequiredDialogProps } from '@s-oram/show-dialog'

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

Then we need to use the dialog:

```tsx
import { useShowDialog } from '@s-oram/show-dialog'
import { ConfirmDialog } from './ConfirmDialog'
import { deleteProjectAction } from './api'

export const ProjectSettings ({ projectId }: { projectId: string }) => {

  const showDialog = useShowDialog()

  const handleResult = (modalResult: string) => {
    if (modalResult === 'OK') {
        deleteProjectAction()
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

Finally we need to add the `<ShowDialogProvider/>` to our application:

```tsx
import { ShowDialogProvider } from '@s-oram/show-dialog'
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
