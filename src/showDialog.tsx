import {
	Fragment,
	createContext,
	useCallback,
	useContext,
	useState,
	type ComponentProps,
	type ComponentPropsWithoutRef,
	type ComponentType,
	type ReactNode,
} from 'react'

export const generateUniqueId = (prefix: string = ''): string => {
	const timestamp = Date.now().toString(36)
	const randomValue = Math.random().toString(36).substring(2)
	return `${prefix}${timestamp}${randomValue}`
}

export type ComponentStackItem = [
	id: string,
	component: ComponentType<any>,
	props: any,
]

export const renderComponentStack = (componentStack: ComponentStackItem[]) => (
	<Fragment>
		{componentStack.map(([id, DialogComponent, props]) => (
			<DialogComponent {...props} key={id} />
		))}
	</Fragment>
)

type AddComponentFunc = (
	id: string,
	component: ComponentType<any>,
	props: any,
) => void

type RemoveComponentFunc = (id: string) => void

type ShowDialogFunc = <T extends RequiredDialogProps>(
	DialogComponent: ComponentType<T>,
	onModalResult: (modalResult: string) => void,
	dialogProps?: Omit<T, keyof RequiredDialogProps>,
) => void

type ShowDialogContext = {
	addComponent?: AddComponentFunc
	removeComponent?: RemoveComponentFunc
}

/**
 * All dialogs must implement the `RequiredDialogProps`.
 *
 * For example:
 * ```ts
 * const MyDialogComponent = (props: RequiredDialogProps & { variant: 'large' | 'small'}) => { ... }
 *
 * ```
 */
export type RequiredDialogProps = {
	open: boolean
	onModalResult: (modalResult: string) => void
}

/**
 * Dialogs have `RequiredDialogProps` and any number of other additional props.
 *
 * The additional dialog props type can be used to create types matching these
 * additional props.
 *
 * For example:
 * ```ts
 * const MyDialogComponent = (props: RequiredDialogProps & { variant: 'large' | 'small'}) => { ... }
 *
 * const MyAdditionalProps = AdditionalDialogProps<typeof MyDialogComponent>
 * // MyAdditionalProps = { variant: 'large' | 'small' } *
 * ```
 */
export type AdditionalDialogProps<T extends React.FunctionComponent<any>> =
	Omit<ComponentPropsWithoutRef<T>, keyof RequiredDialogProps>

const context = createContext<ShowDialogContext>({})

export const useShowDialog = () => {
	const { addComponent, removeComponent } = useContext(context)

	if (!addComponent || !removeComponent) {
		throw new Error(
			'The useShowDialog hook must be used from within a <ShowDialogProvider> component',
		)
	}

	const showDialog = useCallback<ShowDialogFunc>(
		(DialogComponent, onModalResult, props) => {
			const id = generateUniqueId('dialog')

			const requiredProps: RequiredDialogProps = {
				open: true,
				onModalResult: (mr: any) => {
					// TODO[Shannon]: Right now the dialog is always `open: true`. It is just abruptly removed from the
					// component tree when the dialog is closed. It would be a nice extra if we first toggled the
					// `open` to `false`, waited for 200ms and then removed the component from the component tree.
					removeComponent(id)
					onModalResult(mr)
				},
			}

			const allProps = {
				...props,
				...requiredProps,
			} as ComponentProps<typeof DialogComponent>

			addComponent(id, DialogComponent, allProps)
		},
		[addComponent, removeComponent],
	)

	return showDialog
}

/**
 * Assists with modal dialogs by providing requirements for the `useShowDialog` hook.
 */
export const ShowDialogProvider = ({ children }: { children?: ReactNode }) => {
	const [componentStack, setComponentStack] = useState<ComponentStackItem[]>([])

	const addComponent: AddComponentFunc = (
		id: string,
		component: ComponentType<any>,
		props: any,
	) => {
		setComponentStack(stack => [...stack, [id, component, props]])
	}

	const removeComponent: RemoveComponentFunc = (id: string) => {
		setComponentStack(stack => [...stack.filter(item => item[0] !== id)])
	}

	return (
		<context.Provider value={{ addComponent, removeComponent }}>
			{renderComponentStack(componentStack)}
			{children}
		</context.Provider>
	)
}
