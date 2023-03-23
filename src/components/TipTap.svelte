<script>
    import { onMount, onDestroy } from 'svelte';
    import { Editor } from '@tiptap/core';
    import StarterKit from '@tiptap/starter-kit';

    import store from '../store/redux';
    import { actions } from '../store/slices/editor';

    let element;
    let editor;
    
    export let dispatcher;
    export let initial;


    onMount(() => {
        editor = new Editor({
            element: element,
            extensions: [
                StarterKit
            ],
            content: initial || '<p></p>',
            onTransaction: () => {
                editor = editor;
            },
            onUpdate: ({ editor }) => {
                // $store = editor.getHTML();
                store.dispatch(actions.updateHtml(editor.getHTML()));
                store.dispatch(actions.updateJson(editor.getJSON()));
                if ( dispatcher && typeof dispatcher === 'function')
                {
                    dispatcher({
                        html: editor.getHTML(),
                        json: editor.getJSON()
                    });
                }
            }
        });
        store.dispatch(actions.updateHtml(editor.getHTML()));
        store.dispatch(actions.updateJson(editor.getJSON()));
    });

    onDestroy(() => {
        if ( editor ) {
            store.dispatch(actions.clearEditorState());
            editor.destroy();
        }
    });
</script>

<style>
    #editor {
        border: 1px solid #efefef;
        background-color: #f8f9fa;
        border-radius: .375rem;
        overflow: hidden;
    }
    #editor-menu {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-evenly;
        
    }
    #editor-menu > button {
        flex-grow: 1;
        border: none;
    }

    :global(.ProseMirror) {
        background-color: white;
        border-top:1px solid #efefef;
        padding:.375rem .75rem;
    }
    :global(#editor:focus) {
        color: var(--bs-body-color);
        background-color: var(--bs-form-control-bg);
        border-color: #86b7fe;
        outline: 0;
        box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 25%);
    }
</style>

<div id="editor">

    {#if editor}
        <div id="editor-menu">
            <button
            on:click={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            class={editor.isActive("bold") ? "is-active" : ""}
            >
            bold
            </button>
            <button
            on:click={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            class={editor.isActive("italic") ? "is-active" : ""}
            >
            italic
            </button>
            <button
            on:click={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            class={editor.isActive("strike") ? "is-active" : ""}
            >
            strike
            </button>
            <button
            on:click={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            class={editor.isActive("code") ? "is-active" : ""}
            >
            code
            </button>
            <button on:click={() => editor.chain().focus().unsetAllMarks().run()}> clear marks </button>
            <button on:click={() => editor.chain().focus().clearNodes().run()}> clear nodes </button>
            <button
            on:click={() => editor.chain().focus().toggleOrderedList().run()}
            class={editor.isActive("orderedList") ? "is-active" : ""}
            >
            ordered list
            </button>
            <button
            on:click={() => editor.chain().focus().toggleCodeBlock().run()}
            class={editor.isActive("codeBlock") ? "is-active" : ""}
            >
            code block
            </button>
            <button
            on:click={() => editor.chain().focus().toggleBlockquote().run()}
            class={editor.isActive("blockquote") ? "is-active" : ""}
            >
            blockquote
            </button>
            <button on:click={() => editor.chain().focus().setHorizontalRule().run()}>
            horizontal rule
            </button>
            <button on:click={() => editor.chain().focus().setHardBreak().run()}> hard break </button>
            <button
            on:click={() => editor.chain().focus().setParagraph().run()}
            class={editor.isActive("paragraph") ? "is-active" : ""}
            >
            paragraph
            </button>
            <button
            on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            class={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
            >
            h1
            </button>
            <button
            on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            class={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
            >
            h2
            </button>
            <button
            on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            class={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
            >
            h3
            </button>
            <button
            on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            class={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
            >
            h4
            </button>
            <button
            on:click={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            class={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
            >
            h5
            </button>
            <button
            on:click={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            class={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
            >
            h6
            </button>
            <button
            on:click={() => editor.chain().focus().toggleBulletList().run()}
            class={editor.isActive("bulletList") ? "is-active" : ""}
            >
            bullet list
            </button>
            <button
            on:click={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            >
            undo
            </button>
            <button
            on:click={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            >
            redo
            </button>
        </div>
    {/if}
    <div bind:this={element} />
</div>