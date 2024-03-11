// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, it } from 'vitest'
import {
	ShowDialogProvider,
	generateUniqueId,
	renderComponentStack,
	useShowDialog,
	type ComponentStackItem,
	type RequiredDialogProps,
} from './showDialog'

// Mock component for testing
const MockDialog: React.FC<RequiredDialogProps> = ({ open, onModalResult }) => {
	return (
		<div>
			<button onClick={() => onModalResult('result')}>Close Dialog</button>
		</div>
	)
}

describe('generateUniqueId', () => {
	it('should generate a unique ID', () => {
		const id1 = generateUniqueId()
		const id2 = generateUniqueId()
		expect(id1).not.toBe(id2)
	})

	it('should include the prefix', () => {
		const id = generateUniqueId('prefix-')
		expect(id.startsWith('prefix-')).toBeTruthy()
	})
})

describe('renderComponentStack', () => {
	it('should render the component stack correctly', () => {
		const componentStack: ComponentStackItem[] = [
			['id1', MockDialog, { open: true, onModalResult: () => {} }],
			['id2', MockDialog, { open: true, onModalResult: () => {} }],
		]
		render(renderComponentStack(componentStack))
		expect(screen.getAllByText('Close Dialog')).toHaveLength(2)
	})
})

describe('useShowDialog', () => {
	it('should render a dialog component with the correct props', async () => {
		const TestComponent: React.FC = () => {
			const showDialog = useShowDialog()
			const handleModalResult = () => {}

			return (
				<button
					onClick={() => showDialog(MockDialog, handleModalResult)}
					data-testid="show-dialog"
				>
					Show Dialog
				</button>
			)
		}

		render(
			<ShowDialogProvider>
				<TestComponent />
			</ShowDialogProvider>,
		)

		await userEvent.click(screen.getByTestId('show-dialog'))
		expect(screen.getByText('Close Dialog')).toBeInTheDocument()
		await userEvent.click(screen.getByText('Close Dialog'))
		expect(screen.queryByText('Close Dialog')).not.toBeInTheDocument()
	})
})
