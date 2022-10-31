import 'jest';
import convert from 'convert-units';

describe('status integration tests', () => {

    it('conversion test from string', () => {
        expect(convert(Number("1000")).from("oz").to("kg")).toBe(28.3495)
    });

});