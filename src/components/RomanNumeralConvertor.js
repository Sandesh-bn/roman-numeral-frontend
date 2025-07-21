import { Button, defaultTheme, Provider } from '@adobe/react-spectrum';
import { TextField, Heading, Text } from '@adobe/react-spectrum';
import { useState } from 'react';

export function RomanNumeralConvertor() {
    const [romanNumeral, setRomanNumeral] = useState('');
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setError] = useState('');

    function handleSubmit() {
        fetch("http://localhost:8080/romannumeral?query=" + userInput)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoading(false);
                    setRomanNumeral(romanNumeral);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoading(false);
                    setError(error);
                }
            )
    }

    return (
        <Provider colorScheme="light" theme={defaultTheme}>
            <Heading level={1}>Roman numeral convertor</Heading>
            <TextField
                type="number"
                label="Enter a number"
                value={userInput}
                onChange={(e) => setUserInput(e)}
            />
            <br />
            <Button
                variant="primary"
                onPress={() => alert('Hey there!')}
            >
                Convert to roman numeral
            </Button>
            <Heading level={4}>Roman numeral: </Heading><Text>{romanNumeral}</Text>
            {userInput}
        </Provider>
    );
}