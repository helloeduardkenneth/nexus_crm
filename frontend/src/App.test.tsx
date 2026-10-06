import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { useUiPreferences } from './state/uiPreferences'

beforeEach(() => {
  useUiPreferences.setState(useUiPreferences.getInitialState(), true)
  window.history.replaceState(null, '', '/')
})

describe('frontend foundation', () => {
  it('renders the Home foundation content and navigation', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'NexusCRM' })).toBeInTheDocument()
    expect(screen.getByText('Frontend foundation is ready.')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  })

  it('navigates through the actual router while preserving the shell', async () => {
    const user = userEvent.setup()
    render(<App />)
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })

    await user.click(screen.getByRole('link', { name: 'Foundation' }))
    expect(screen.getByRole('heading', { name: 'Frontend foundation' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/foundation')
    expect(screen.getByRole('link', { name: 'Foundation' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBe(navigation)

    await user.click(screen.getByRole('link', { name: 'Home' }))
    expect(screen.getByRole('heading', { name: 'NexusCRM' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/')
  })

  it('recovers from an unmatched route through the home link', async () => {
    window.history.replaceState(null, '', '/missing-foundation-path')
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Return home' }))
    expect(screen.getByRole('heading', { name: 'NexusCRM' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/')
  })

  it('starts with the nonpersistent preference reset', () => {
    window.history.replaceState(null, '', '/foundation')
    render(<App />)

    expect(screen.getByRole('checkbox', { name: 'Compact spacing' })).not.toBeChecked()
    expect(screen.getByRole('main').parentElement).toHaveClass('p-8', 'space-y-8')
  })

  it('shares compact spacing across navigation and switches it off', async () => {
    window.history.replaceState(null, '', '/foundation')
    const user = userEvent.setup()
    render(<App />)
    const shell = screen.getByRole('main').parentElement

    await user.click(screen.getByRole('checkbox', { name: 'Compact spacing' }))
    expect(shell).toHaveClass('p-4', 'space-y-4')
    expect(shell).not.toHaveClass('p-8')
    await user.click(screen.getByRole('link', { name: 'Home' }))
    expect(screen.getByRole('heading', { name: 'NexusCRM' })).toBeInTheDocument()
    expect(shell).toHaveClass('p-4')
    await user.click(screen.getByRole('link', { name: 'Foundation' }))
    expect(screen.getByRole('checkbox', { name: 'Compact spacing' })).toBeChecked()
    await user.click(screen.getByRole('checkbox', { name: 'Compact spacing' }))
    expect(shell).toHaveClass('p-8', 'space-y-8')
    expect(shell).not.toHaveClass('p-4')
  })
})

describe('technical preview form', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/foundation')
  })

  it('shows an associated required error without a successful preview', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Preview' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Enter a preview label.')
    expect(screen.getByRole('textbox', { name: 'Preview label.' })).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('textbox', { name: 'Preview label.' })).toHaveAccessibleDescription('Enter a preview label.')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('rejects 41 characters with an associated error', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Preview label.' })

    await user.type(input, 'x'.repeat(41))
    await user.click(screen.getByRole('button', { name: 'Preview' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Use 40 characters or fewer.')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Use 40 characters or fewer.')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it.each(['Local preview', 'x'.repeat(40)])('accepts valid input: %s', async (value) => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Preview label.' })

    await user.type(input, value)
    await user.click(screen.getByRole('button', { name: 'Preview' }))
    expect(await screen.findByRole('status')).toHaveTextContent(`Submitted preview: ${value}`)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'false')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('clears a previous preview when a subsequent submission is invalid', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Preview label.' })

    await user.type(input, 'Previous preview')
    await user.click(screen.getByRole('button', { name: 'Preview' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Submitted preview: Previous preview')

    await user.clear(input)
    await user.click(screen.getByRole('button', { name: 'Preview' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Enter a preview label.')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
