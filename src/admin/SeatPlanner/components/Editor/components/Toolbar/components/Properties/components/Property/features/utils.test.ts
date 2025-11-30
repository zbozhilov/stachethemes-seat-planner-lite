import { getIncrementValueByRegex } from './utils';

describe('getIncrementValueByRegex', () => {
    it('should return the original value if it does not end with "!"', () => {
        expect(getIncrementValueByRegex('[A*3]', 0)).toBe('[A*3]');
    });

    it('should return the original value if it does not contain valid patterns', () => {
        expect(getIncrementValueByRegex('invalid!', 0)).toBe('invalid!');
    });

    it('should handle linear numeric increment', () => {
        expect(getIncrementValueByRegex('[1*3]!', 0)).toBe('1');
        expect(getIncrementValueByRegex('[1*3]!', 3)).toBe('2');
        expect(getIncrementValueByRegex('[1*3]!', 6)).toBe('3');
    });

    it('should handle linear character increment', () => {
        expect(getIncrementValueByRegex('[A*3]!', 0)).toBe('A');
        expect(getIncrementValueByRegex('[A*3]!', 3)).toBe('B');
        expect(getIncrementValueByRegex('[A*3]!', 6)).toBe('C');
    });

    it('should handle cyclic numeric increment', () => {
        expect(getIncrementValueByRegex('[1~3]!', 0)).toBe('1');
        expect(getIncrementValueByRegex('[1~3]!', 3)).toBe('1');
        expect(getIncrementValueByRegex('[1~3]!', 6)).toBe('1');
    });

    it('should handle cyclic character increment', () => {
        expect(getIncrementValueByRegex('[A~3]!', 0)).toBe('A');
        expect(getIncrementValueByRegex('[A~3]!', 3)).toBe('A');
        expect(getIncrementValueByRegex('[A~3]!', 6)).toBe('A');
    });

    it('should handle combined patterns', () => {
        expect(getIncrementValueByRegex('[A*3]-[1~3]!', 0)).toBe('A-1');
        expect(getIncrementValueByRegex('[A*3]-[1~3]!', 3)).toBe('B-1');
        expect(getIncrementValueByRegex('[A*3]-[1~3]!', 6)).toBe('C-1');
    });

   
});