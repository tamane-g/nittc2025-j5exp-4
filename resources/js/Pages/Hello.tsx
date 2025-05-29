import { Head } from '@inertiajs/react';
import { Text } from '@mantine/core';
import type { FC } from 'react';

const Hello: FC = () => {
    return (
        <>
            <Head title="Hello World" />
            <Text>Hello World!</Text>
        </>
    );
};

export default Hello;