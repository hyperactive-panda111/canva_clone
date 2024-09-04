import { useEvent } from 'react-use';

export const useWindowEvents = () => {
    useEvent('beforeunload', (event) => {
        // Modern way to handle beforeunload event
       // event.preventDefault(); // Some browsers require this line
        event.returnValue = 'Are you sure you want to leave?'; // Standard way to set the message
    });
};
