<script lang="ts">
    import { Col, Row } from "@sveltestrap/sveltestrap";
    import { diffWords, diffLines } from 'diff';

    export let oldText: string | undefined;
    export let newText: string | undefined;
    export let removedColor: string = 'red';
    export let addedColor: string = 'limegreen';
    export let replacedColor: string = 'yellow';
    export let emptyColor: string = 'lightgrey';
    export let backgroundColor: string = 'white';

    let color: {
        newText: { [key: string]: string },
        oldText: { [key: string]: string }
    }
    color = {
        newText: {
            added: addedColor,
            removed: emptyColor,
            replaced: replacedColor
        },
        oldText: {
            added: emptyColor,
            removed: removedColor,
            replaced: replacedColor
        }
    }

    class MyChangeLine {
        oldText: Array<any>;
        newText: Array<any>;
        changeType: string; //One of added, removed, or replaced, or unchanged

        constructor(oldText: Array<any>, newText: Array<any>, changeType: string) {
            this.oldText = oldText;
            this.newText = newText;
            this.changeType = changeType;

            const CHANGE_TYPES = ['added', 'removed', 'replaced', 'unchanged', 'edit-added', 'edit-removed'];
            //throw error if changeType is not one of the four
            if (!CHANGE_TYPES.includes(changeType)) {
                throw new Error('Invalid change type');
            }
        }
        
        toString() {
            return `Old: ${this.oldText}, New: ${this.newText}, Change Type: ${this.changeType}`;
        }
    }

    // Function to highlight the differences between two strings
    function myDiffLines(oldString: string, newString: string) {
        let diff = diffLines(oldString, newString, { ignoreWhitespace: false, newlineIsToken: false});
        let myChangeLineArray: Array<MyChangeLine> = [];

        for (let i = 0; i < diff.length; i++) {
            //CASE: Line was replaced
            // Found when diff[i].removed and diff[i+1].added
            if (i < diff.length - 1 && diff[i].removed && diff[i + 1].added) {
                //When a line is replaces, check the diff for the words
                let diffArrays = myDiffWordsArray(diff[i].value, diff[i + 1].value);
                myChangeLineArray.push(new MyChangeLine(diffArrays.oldOutputArray, diffArrays.newOutputArray, 'replaced'));
                i++;
            }
            //CASE: Line was removed
            // Found when diff[i].removed and !diff[i+1].added
            // !diff[i+1].added may be redundant
            else if (diff[i].removed && (i === diff.length - 1 || !diff[i + 1].added)) {
                myChangeLineArray.push(new MyChangeLine([{text: diff[i].value}], [{text:''}], 'removed'));
            }
            //CASE: Line was added
            // Found when diff[i].added and !diff[i-1].removed
            // !diff[i-1].removed may be redundant
            else if (diff[i].added && (i === 0 || !diff[i - 1].removed)) {
                myChangeLineArray.push(new MyChangeLine([{text:''}], [{text: diff[i].value}], 'added'));
            }
            //CASE: Line was not changed
            // Found when !diff[i].added and !diff[i].removed
            else if (!diff[i].added && !diff[i].removed) {
                //diff.value for unchanged lines is multiple line, so we need to split it by new line
                let unchangedLines = diff[i].value.split('\n');

                for (let j = 0; j < unchangedLines.length; j++) {
                    myChangeLineArray.push(new MyChangeLine([{text: unchangedLines[j]}], [{text: unchangedLines[j]}], 'unchanged'));
                }
            }
        }

        return myChangeLineArray
    }

    //Function to get word changes between two texts and return an object arrays of oldstring and newstring
    function myDiffWordsArray(oldString: string, newString: string) {
        let diff = diffWords(oldString, newString, { ignoreWhitespace: true });

        let oldOutputArray = [];
        let newOutputArray = [];

        for(let i = 0; i < diff.length; i++) {
            if (diff[i].added) {
                newOutputArray.push({text: diff[i].value, added:true});
            } else if (diff[i].removed) {
                oldOutputArray.push({text: diff[i].value, removed:true});
            } else {
                oldOutputArray.push({text: diff[i].value});
                newOutputArray.push({text: diff[i].value});
            }
        }

        return {oldOutputArray, newOutputArray};
    }

    let myChangeLineArray: Array<MyChangeLine> = [];
    let editedMyChangeLineArray: Array<MyChangeLine> = [];
    //Get the changes between the lines of the two texts
    $: if (oldText && newText) {
        //Strip /r from the text
        oldText = oldText.replace(/\r/g, '');
        newText = newText.replace(/\r/g, '');

        myChangeLineArray = myDiffLines(oldText, newText);
    }

    function textAreaHeight(element: HTMLTextAreaElement) {
        element.style.height = 'auto';
        element.style.height = (element.scrollHeight) + 4 + 'px';
    }

</script>

<div style="background-color: {backgroundColor};">
    <Row>
        <Col>
            <h2>Original:</h2>
        </Col>
        <Col>
            <h2>Remediated:</h2>
        </Col>
    </Row>
    {#each myChangeLineArray as myChangeLine}
        <Row>  
            <div class="col" style="background-color: {color.oldText[myChangeLine.changeType]}">
                {#each myChangeLine.oldText as oldTextObj}
                    {#if oldTextObj.removed}
                        <mark style="background-color: {removedColor};">{oldTextObj.text}</mark>
                    {:else}
                        {oldTextObj.text}
                    {/if}
                {/each}
            </div>
            <div class="col" style="background-color: {color.newText[myChangeLine.changeType]}">
                {#each myChangeLine.newText as newTextObj}
                    {#if newTextObj.added}
                        <mark style="background-color: {addedColor};">{newTextObj.text}</mark>
                    {:else}
                        {newTextObj.text}
                    {/if}
                {/each}
            </div>
        </Row>
    {/each}
</div>


<style>
    div {
        white-space: break-spaces;
        margin: 0;
    }
</style>