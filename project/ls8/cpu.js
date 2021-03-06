/**
 * LS-8 v2.0 emulator skeleton code
 */
    const LDI = 0b10011001;
    const PRN = 0b01000011;
    const HLT = 0b00000001;
    const MUL = 0b10101010;
    //double check this
/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        //below, new Array(8) because there are 8 registers
        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        
        // Special-purpose registers
        this.PC = 0; // Program Counter
    }
    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
        //above we have a call into ram, apparently ram has a write method that lets us store 
        //a byte of data into a memory address
        //ram gets passed in in cpu.js at new CPU(ram);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                // this.reg[regA] *= this.reg[regB];
                this.reg[regA] = (this.reg[regB] * this.reg[regA]) & 0xff;
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)
        const IR = this.ram.read(this.PC);
        // !!! IMPLEMENT ME

        // Debugging output
        //below prints out the address of the instruction, and the actual instruction
        // console.log(`${this.PC}: ${IR.toString(2)}`);

        //above is converting it to a binary string so that we can print it out

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        const operandA = this.ram.read(this.PC + 1);
        const operandB = this.ram.read(this.PC + 2);

        // !!! IMPLEMENT ME

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        switch(IR) {
            case LDI:
                //set the value in a register
                //since operand A is the register number, and operand B is the value
                this.reg[operandA] = operandB;
                //we need to move ahead 3 bytes
                // this.PC += 3;// next instruction
                // to peak inside --> console.log(this.reg[operandA]);
                break;
            case PRN:
                console.log(this.reg[operandA]);
                // this.PC += 2;
                break;
            case MUL:
                this.alu("MUL", operandA, operandB);
                break;
            case HLT:
                this.stopClock();
                // this.PC =+ 1;
                break;

            //case MUL:
            //    this.alu(MUL)

            default:
                console.log("Unknown instruction: " + IR.toString(2));
                this.stopClock();
                return;
        }

        // !!! IMPLEMENT ME

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        const instLen = (IR >> 6) + 1;
        this.PC += instLen;
        // !!! IMPLEMENT ME
    }
}

module.exports = CPU;
