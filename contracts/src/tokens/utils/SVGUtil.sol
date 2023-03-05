// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import {Base64} from './Base64.sol';
import {Strings} from './Strings.sol';

contract SVGUtil {
    using Strings for uint8;
    using Strings for uint256;

    function _upper() internal pure returns (string memory) {
        return
            "<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'><defs><radialGradient id='gradient' cx='50%' cy='35%'>";
    }

    function _colors(bytes32 seed)
        internal
        pure
        returns (
            string memory c1,
            string memory c2,
            string memory c3
        )
    {
        c1 = string.concat(
            'rgb(',
            uint8(seed[0]).toString(),
            ',',
            uint8(seed[1]).toString(),
            ',',
            uint8(seed[2]).toString(),
            ')'
        );
        c2 = string.concat(
            'rgb(',
            uint8(seed[10]).toString(),
            ',',
            uint8(seed[11]).toString(),
            ',',
            uint8(seed[12]).toString(),
            ')'
        );
        c3 = string.concat(
            'rgb(',
            uint8(seed[20]).toString(),
            ',',
            uint8(seed[21]).toString(),
            ',',
            uint8(seed[22]).toString(),
            ')'
        );
    }

    function _stops(bytes32 seed)
        internal
        pure
        returns (
            string memory stop1,
            string memory stop2,
            string memory stop3
        )
    {
        (string memory c1, string memory c2, string memory c3) = _colors(seed);

        stop1 = string.concat(
            "<stop offset='0%' stop-color='",
            c1,
            "'><animate attributeName='stop-color' values='",
            c1,
            ';',
            c2,
            ';',
            c3,
            ';',
            c1,
            "' dur='2s' repeatCount='indefinite'></animate></stop>"
        );
        stop2 = string.concat(
            "<stop offset='50%' stop-color='",
            c2,
            "'><animate attributeName='stop-color' values='",
            c2,
            ';',
            c3,
            ';',
            c1,
            ';',
            c2,
            "' dur='2s' repeatCount='indefinite'></animate></stop>"
        );
        stop3 = string.concat(
            "<stop offset='100%' stop-color='",
            c3,
            "'><animate attributeName='stop-color' values='",
            c3,
            ';',
            c1,
            ';',
            c2,
            ';',
            c3,
            "' dur='2s' repeatCount='indefinite'></animate></stop>"
        );
    }

    function _lower() internal pure returns (string memory) {
        return
            "</radialGradient></defs><circle cx='50%' cy='50%' r='100' fill=\"url('#gradient')\"/><text x='32%' y='70%' font-size='150' rotate='90%' fill='black'>)</text>";
    }

    function _eyes(string memory left, string memory right)
        internal
        pure
        returns (string memory)
    {
        if (bytes(left).length == 0) {
            left = '.';
        }

        if (bytes(right).length == 0) {
            right = '.';
        }

        return
            string.concat(
                "<text x='17.5%' y='60%' font-size='40' fill='black' text-anchor='middle'>",
                left,
                "</text><text x='82.5%' y='60%' font-size='40' fill='black' text-anchor='middle'>",
                right,
                '</text></svg>'
            );
    }

    function _image(
        bytes32 seed,
        string memory left,
        string memory right
    ) internal pure returns (string memory) {
        (
            string memory stop1,
            string memory stop2,
            string memory stop3
        ) = _stops(seed);
        return
            string.concat(
                'data:image/svg+xml;base64,',
                Base64.encode(
                    abi.encodePacked(
                        string.concat(
                            _upper(),
                            stop1,
                            stop2,
                            stop3,
                            _lower(),
                            _eyes(left, right)
                        )
                    )
                )
            );
    }

    function _uri(
        uint256 id,
        bytes32 seed,
        string memory left,
        string memory right
    ) internal pure returns (string memory) {
        return
            string.concat(
                'data:application/json;base64,',
                Base64.encode(
                    abi.encodePacked(
                        string.concat(
                            '{"name":"ORB #',
                            id.toString(),
                            '", "image":"',
                            _image(seed, left, right),
                            '"}'
                        )
                    )
                )
            );
    }
}
