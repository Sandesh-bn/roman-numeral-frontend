import { Button, defaultTheme, Provider } from '@adobe/react-spectrum';
import { TextField, Heading, Text, Grid, View } from '@adobe/react-spectrum';
import { useState } from 'react';
import Moon from '@spectrum-icons/workflow/Moon';
import Light from '@spectrum-icons/workflow/Light';

export function RomanNumeralConvertor() {
    const [romanNumeral, setRomanNumeral] = useState('');
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setError] = useState('');
    const [colorScheme, setColorScheme] = useState('light');

    function handleSubmit() {
        let integer = parseInt(userInput);

        if (integer > 0 && integer < 4000) {
            // fetch("http://localhost:8080/romannumeral?query=" + userInput)
            fetch("https://roman-number-backend.vercel.app/romannumeral?query=" + userInput)
                .then(res => res.json())
                .then(
                    (result) => {
                        setIsLoading(false);
                        setRomanNumeral(result.output);
                    },
                    (error) => {
                        setIsLoading(false);
                        setError(error);
                    }
                )
        }
        else {
            setRomanNumeral('')
        }

    }

    function handleKeyDown(e) {
        if (e.key == 'Enter')
            handleSubmit();
    }

    function handleChange(inputValue) {
        setUserInput(inputValue);
        setRomanNumeral('')
        const numericValue = parseInt(inputValue, 10);

        if (inputValue === '') {
            setError(null);
        } else if (isNaN(numericValue)) {
            setError('Please enter a valid number.');
        }
        else if (numericValue <= 0) {
            setError('Roman numerals do not support negative numbers or zero.');
        }
        else if (numericValue > 3999) {
            setError('Value must not exceed 3999.');
        } else {
            setError(null);
        }
    }

    function toggleColorScheme() {
        setColorScheme(colorScheme == 'light' ? 'dark' : 'light')
    }

    const validationState = userInput === ''
        ? undefined
        : errorMessage
            ? 'invalid'
            : 'valid';

    return (
        <Provider colorScheme={colorScheme} theme={defaultTheme}>
            <View padding={'size-100'} height={'100vh'} >
                {colorScheme == 'light' ?
                    <div onClick={() => toggleColorScheme()}>
                        <Moon aria-label="Toggle Color Scheme" />
                    </div> :
                    <div onClick={() => toggleColorScheme()}>
                        <Light aria-label="Toggle Color Scheme" />
                    </div>
                }

                <Grid justifyContent={'center'} height="50%">
                    <Heading level={1}>Roman numeral convertor</Heading>
                    <TextField
                        type="number"
                        label="Enter a number"
                        value={userInput}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                        validationState={validationState}
                        errorMessage={errorMessage}
                        isRequired
                    />
                    <br />
                    <Button
                        variant="primary"
                        onPress={() => handleSubmit()}
                    >
                        Convert to roman numeral
                    </Button>
                    <Heading level={4}>Roman numeral: </Heading><Text>{romanNumeral}</Text>
                </Grid>
            </View>
        </Provider>
    );
}