import { Button, defaultTheme, Provider } from '@adobe/react-spectrum';
import { TextField, Heading, Text, Grid, View } from '@adobe/react-spectrum';
import { useState } from 'react';
import Moon from '@spectrum-icons/workflow/Moon';
import Light from '@spectrum-icons/workflow/Light';
import './RomanNumeralConvertor.css';
import log from '../logger';

export function RomanNumeralConvertor() {
    const isLight = window.matchMedia("(prefers-color-scheme:light)").matches; // determine user setting for color scheme
    const [romanNumeral, setRomanNumeral] = useState('');
    const [userInput, setUserInput] = useState('');
    const [errorMessage, setError] = useState('');
    const [colorScheme, setColorScheme] = useState(isLight ? 'light' : 'dark');

    function handleSubmit() {
        let integer = parseInt(userInput)
        if (integer > 0 && integer < 4000) {
            fetch("http://localhost:8080/romannumeral?query=" + userInput)
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error(`Server responded with status ${res.status}`);
                    }
                    try {
                        return await res.json();
                    } catch (error) {
                        log.error(`Fetch failed or invalid response`);
                        throw new Error("Invalid JSON response from server");
                    }
                })
                .then(
                    (result) => {
                        log.info(`Conversion successful: ${userInput} -> ${result.output}`);
                        setRomanNumeral(result.output);
                        setError(null);
                    }
                )
                .catch((error) => {
                    log.error(`Fetch failed or invalid response: ${error.message}`);
                    setRomanNumeral('');
                    setError("Could not retrieve data. Please check your internet connection or try again later.");
                });
        } else {
            log.warn(`Invalid input for conversion: ${userInput}`);
            setRomanNumeral('');
            setError("Please enter a number between 1 and 3999.");
        }
    }

    // To trigger conversion when user presses enter
    function handleKeyDown(e) {
        if (e.key == 'Enter')
            handleSubmit();
    }

    // event handler as user types integer
    function handleChange(inputValue) {
        setUserInput(inputValue);
        setRomanNumeral('')
        const numericValue = parseInt(inputValue, 10);

        if (inputValue === '') {
            setError(null);
        }
        else if (isNaN(numericValue)) {
            log.warn(`Invalid input: ${inputValue}`);
            setError('Please enter a valid number.');
        }
        else if (inputValue.includes('.')) {
            log.warn(`Invalid Decimal input: ${inputValue}`);
            setError("Number cannot be a decimal.")
        }
        else if (numericValue <= 0) {
            log.warn(`Roman numerals do not support negative numbers or zero. ${inputValue}`);
            setError('Roman numerals do not support negative numbers or zero.');
        }
        else if (numericValue > 3999) {
            log.warn(`Value must not exceed 3999: ${inputValue}`);
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

                <Grid justifyContent={'center'} height="40%">
                    <Heading level={1}>Roman numeral convertor</Heading>
                    <div
                        className='input-container'
                    >
                        <TextField
                            type="number"
                            position={"absolute"}
                            width="100%"
                            label="Enter a number:"
                            value={userInput}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            validationState={validationState}
                            errorMessage={errorMessage}
                            isRequired
                        />
                    </div>
                    <Button
                        variant="primary"
                        onPress={() => handleSubmit()}
                    >
                        Convert to roman numeral
                    </Button>
                    <Text  data-testid="roman-result"><b>Roman numeral: </b>{romanNumeral}</Text>
                </Grid>
            </View>
        </Provider>
    );
}