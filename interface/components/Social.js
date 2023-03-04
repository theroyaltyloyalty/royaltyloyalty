import { gql } from '@apollo/client';
import {
    Button, Container, Heading, Menu, MenuButton, MenuItem, MenuList, Text
} from '@chakra-ui/react';
import * as React from 'react';
import { useContext, useState } from 'react';
import { MainContext } from '../contexts/MainContext';
import { mutateFollowFee } from '../gqlQueries';
import { useApolloClient, useCheckFollower, useToastErr } from '../hooks';


export function Social({ address, id }) {
    const toastErr = useToastErr();
    const { data: doesFollow } = useCheckFollower(address, id);
    const { profile } = useContext(MainContext);
    const client = useApolloClient();
    const { accessToken, profileId } = profile;

    function setFollowFee() {
        // TODO: frh -> if amount set display on table, also set currency option
        const address = '0x577eBC5De943e35cdf9ECb5BbE1f7D7CB6c7C647';
        // TODO: This is WMATIC, check if other tokens will work
        // TODO: on royaltyReceived their token id they are paying for and so on
        const currency = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';
        const value = 5;

        if (accessToken && profileId) {
            const _mutateFollowFee = gql`${mutateFollowFee(
                profileId, currency, value, address
            )}`;
            client.mutate({
                mutation: _mutateFollowFee,
                context: {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            })
                .then(res => {
                    console.log('res: ', res);
                })
                .catch(err => toastErr(err));
        }
    }

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