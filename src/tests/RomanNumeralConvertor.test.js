import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RomanNumeralConvertor } from '../components/RomanNumeralConvertor'

// mock global.matchMedia which is related to testing user settings
// to determine default color schem (dark/light) when app loads.
beforeAll(() => {
  global.matchMedia = global.matchMedia || function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }
  }
})

// mock fetch api
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ output: 'X' })
    })
  );
});


afterEach(() => {
  jest.clearAllMocks();
});

// Test RomanNumeralConvertor Component
describe('RomanNumeralConvertor Component', () => {
  test('renders input, button, and heading', () => {
    render(<RomanNumeralConvertor />);
    expect(screen.getByText(/Roman numeral convertor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Enter a number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Convert to roman numeral/i })).toBeInTheDocument();
  });

  test('updates input and clears roman numeral result on change', () => {
    render(<RomanNumeralConvertor />);
    const input = screen.getByLabelText(/Enter a number/i);

    fireEvent.change(input, { target: { value: '15' } });
    expect(input.value).toBe('15');
    const resultDisplay = screen.getByTestId('roman-result');
    expect(resultDisplay).toHaveTextContent('Roman numeral:');
    // expect(screen.getByText(/Roman numeral:/i).nextSibling.textContent).toBe('');
  });

  test('shows error for invalid input', () => {
    render(<RomanNumeralConvertor />);
    const input = screen.getByLabelText(/Enter a number/i);

    fireEvent.change(input, { target: { value: '-5' } });
    expect(screen.getByText(/Roman numerals do not support negative numbers or zero./i)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '4000' } });
    expect(screen.getByText(/Value must not exceed 3999./i)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '.5' } });
    expect(screen.getByText(/Please enter a valid number/i)).toBeInTheDocument();
  });

  test('does not call API for invalid input', () => {
    render(<RomanNumeralConvertor />);
    const button = screen.getByRole('button', { name: /Convert to roman numeral/i });
    const input = screen.getByLabelText(/Enter a number/i);

    fireEvent.change(input, { target: { value: '4000' } });
    fireEvent.click(button);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('calls API and displays result on valid input', async () => {
    render(<RomanNumeralConvertor />);
    const input = screen.getByLabelText(/Enter a number/i);
    const button = screen.getByRole('button', { name: /Convert to roman numeral/i });

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(button);

    await waitFor(() => {
      // expect(global.fetch).toHaveBeenCalledWith('https://roman-number-backend.vercel.app/romannumeral?query=10');
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/romannumeral?query=10');
      expect(screen.getByTestId('roman-result')).toHaveTextContent('Roman numeral: X');
    });
  });

  test('handles Enter key to submit', async () => {
    render(<RomanNumeralConvertor />);
    const input = screen.getByLabelText(/Enter a number/i);

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  test('toggles color scheme when icon clicked', () => {
    render(<RomanNumeralConvertor />);
    const toggleIcon = screen.getByLabelText(/Toggle Color Scheme/i);
    fireEvent.click(toggleIcon);
    fireEvent.click(toggleIcon);
  });

  test('shows error message when API fails', async () => {
    global.fetch = jest.fn(() => Promise.reject('API is down'));

    render(<RomanNumeralConvertor />);
    const input = screen.getByLabelText(/Enter a number/i);
    const button = screen.getByRole('button', { name: /Convert to roman numeral/i });

    fireEvent.change(input, { target: { value: '15' } });
    fireEvent.click(button);

    await waitFor(() => {
      const resultDisplay = screen.getByTestId('roman-result');
      expect(resultDisplay).toHaveTextContent('Roman numeral:');
    });
  });

  test('does not call API on empty input', () => {
    render(<RomanNumeralConvertor />);
    const button = screen.getByRole('button', { name: /Convert to roman numeral/i });

    fireEvent.click(button);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('does not show error on valid input', () => {
    render(<RomanNumeralConvertor />);
    const input = screen.getByLabelText(/Enter a number/i);
    fireEvent.change(input, { target: { value: '100' } });

    expect(screen.queryByText(/Please enter a valid number/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Roman numerals do not support/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Value must not exceed/i)).not.toBeInTheDocument();
  });

  test('does not call API when Enter is pressed on empty input', () => {
    render(<RomanNumeralConvertor />);
    const input = screen.getByLabelText(/Enter a number/i);

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('shows error for decimal input', () => {
    render(<RomanNumeralConvertor />);
    const input = screen.getByLabelText(/Enter a number/i);

    fireEvent.change(input, { target: { value: '10.2' } });

    expect(screen.getByText(/Number cannot be a decimal./i)).toBeInTheDocument();
  });
});
