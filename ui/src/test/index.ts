import { expect } from 'chai';
import { Commands } from '../Commands';
import { FileSystem } from '../fs/FileSystem';

describe('Command', () => {
    let fs: FileSystem;
    let command: Commands;
    describe('ls command', () => {
        beforeEach('init fs', () => {
            fs = new FileSystem();
            command = new Commands(fs);    
        });

        it('проверяет, что в корне нет элементов', () => {
            const result = command.ls(new Set());            
            expect(result).is.empty;
        });

        it('должен проверить, что в корне элементов 5', () => {
            command.mkdir(['Dir1', 'Dir2', 'Dir3', 'Dir4', 'Dir5'], new Set())
            const result = command.ls(new Set());            
            expect(result).to.have.lengthOf(5);
        });
    });
    describe('cd command', () => {
        beforeEach('init fs', () => {
            fs = new FileSystem();
            command = new Commands(fs);    
        });

        it('проверяет, что текущая дирректория изменилась', () => {
            command.mkdir(['Dir1', 'Dir2', 'Dir3', 'Dir4', 'Dir5'], new Set());  
            command.cd(['Dir1'], new Set())
            expect(command.getPointer().name).to.equal('Dir1');
        });

        it('проверяет работу cd ..', () => {
            command.mkdir(['Dir1/Dir2/Dir3'], new Set(['p']))
            command.cd(['Dir1', 'Dir2', 'Dir3'], new Set());
            command.cd(['..'], new Set());        
            expect(command.getPointer().name).to.equal('Dir2');
        });

        it('проверяет, что если текущая директория Dir3, то после cd ../Dir3 она не изменится', () => {
            command.mkdir(['Dir1/Dir2/Dir3'], new Set(['p']))
            command.cd(['Dir1', 'Dir2', 'Dir3'], new Set());
            command.cd(['..', 'Dir3'], new Set());        
            expect(command.getPointer().name).to.equal('Dir3');
        });
    });
    
});