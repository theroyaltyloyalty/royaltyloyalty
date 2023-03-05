import { Button, Container, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useCheckFollower } from '../hooks';


export function Social({ address, id }) {
    const { data: doesFollow } = useCheckFollower(address, id);

    return (
        <Container >
            {id && doesFollow
                ? <Text
                    background='#BCFE65'
                    color='#00501E'
                    border='none'
                    borderRadius='4px'
                    width='fit-content'
                    padding='4px 8px'
                    fontWeight='600'
                    fontSize='14px'
                    opacity='0.9'
                    margin='0 auto'
                >
                    Follows you
                </Text>
                : <Button
                    width='fit-content'
                    padding='8px 16px'
                    fontWeight='bold'
                    margin='0 auto'
                    onClick={() => setFollowFee()}
                >
                    Set a follow fee
                </Button>
            }
        </Container>
    );
}