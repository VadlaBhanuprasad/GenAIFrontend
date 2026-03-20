import { useState, useRef, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

let messageIdCounter = 1;

export function useChat(activeMode = 'general') {
    const [messagesByMode, setMessagesByMode] = useState({
        general: [],
        coding: [],
        document: [],
        weblink: [],
    });
    const [isStreaming, setIsStreaming] = useState(false);
    const abortRef = useRef(null);

    const messages = messagesByMode[activeMode] || [];

    // ── Shared SSE parser ───────────────────────────────────────────────────
    const _streamSSE = useCallback(async (url, body, assistantId, mode) => {
        const controller = new AbortController();
        abortRef.current = controller;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.detail || `HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // keep incomplete last line

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const chunk = line.slice(6); // strip "data: "
                if (chunk === '[DONE]') return;
                if (chunk.startsWith('[ERROR]')) {
                    throw new Error(chunk.slice(8));
                }
                
                let textChunk = chunk;
                try {
                    textChunk = JSON.parse(chunk);
                } catch (e) {
                    // fallback to raw string if it's not JSON
                }

                // Append chunk to assistant message in the right mode
                setMessagesByMode(prev => {
                    const modeMsgs = prev[mode] || [];
                    return {
                        ...prev,
                        [mode]: modeMsgs.map(m =>
                            m.id === assistantId
                                ? { ...m, content: m.content + textChunk }
                                : m
                        )
                    };
                });
            }
        }
    }, []);

    // ── Send chat message ───────────────────────────────────────────────────
    const sendMessage = useCallback(async (text, mode = 'general', sessionId = null) => {
        if (!text.trim() || isStreaming) return;

        const userMsg = {
            id: messageIdCounter++,
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        };

        const assistantId = messageIdCounter++;
        const assistantMsg = { id: assistantId, role: 'assistant', content: '', timestamp: new Date(), streaming: true };

        setMessagesByMode(prev => ({
            ...prev,
            [mode]: [...(prev[mode] || []), userMsg, assistantMsg]
        }));
        setIsStreaming(true);

        try {
            // Choose endpoint: if mode=document or mode=weblink use /api/pdf/query, else /api/chat
            if ((mode === 'document' || mode === 'weblink') && sessionId) {
                await _streamSSE(
                    `${API_BASE}/api/pdf/query`,
                    { question: text, session_id: sessionId },
                    assistantId,
                    mode
                );
            } else {
                await _streamSSE(
                    `${API_BASE}/api/chat`,
                    { message: text, mode, session_id: sessionId },
                    assistantId,
                    mode
                );
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                setMessagesByMode(prev => ({
                    ...prev,
                    [mode]: (prev[mode] || []).map(m =>
                        m.id === assistantId
                            ? { ...m, content: m.content || `⚠️ Error: ${err.message}` }
                            : m
                    )
                }));
            }
        } finally {
            setMessagesByMode(prev => ({
                ...prev,
                [mode]: (prev[mode] || []).map(m => m.id === assistantId ? { ...m, streaming: false } : m)
            }));
            setIsStreaming(false);
        }
    }, [isStreaming, _streamSSE]);

    // ── Stop streaming ──────────────────────────────────────────────────────
    const stopStreaming = useCallback(() => {
        if (abortRef.current) {
            abortRef.current.abort();
        }
        setMessagesByMode(prev => {
            const nextState = { ...prev };
            Object.keys(nextState).forEach(mName => {
                nextState[mName] = nextState[mName].map(m => m.streaming ? { ...m, streaming: false } : m);
            });
            return nextState;
        });
        setIsStreaming(false);
    }, []);

    // ── New chat ────────────────────────────────────────────────────────────
    const newChat = useCallback((modeToClear) => {
        if (abortRef.current) abortRef.current.abort();
        setMessagesByMode(prev => ({
            ...prev,
            [modeToClear]: []
        }));
        setIsStreaming(false);
    }, []);

    return { messages, isStreaming, sendMessage, stopStreaming, newChat };
}


// ── Document/URL Upload Hook ─────────────────────────────────────────────────────────
export function useDocumentUpload() {
    const [uploading, setUploading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [error, setError] = useState(null);

    const uploadPDF = useCallback(async (file) => {
        setUploading(true);
        setError(null);
        setSessionId(null);
        setUploadedFile(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE}/api/pdf/upload/sync`, {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || `Upload failed: HTTP ${res.status}`);
            }
            const data = await res.json();
            setSessionId(data.session_id);
            setUploadedFile(file.name);
            return data.session_id;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setUploading(false);
        }
    }, []);

    const uploadURL = useCallback(async (url) => {
        setUploading(true);
        setError(null);
        setSessionId(null);
        setUploadedFile(null);

        try {
            const res = await fetch(`${API_BASE}/api/pdf/url/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || `URL processing failed: HTTP ${res.status}`);
            }
            const data = await res.json();
            setSessionId(data.session_id);
            setUploadedFile(url);
            return data.session_id;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setUploading(false);
        }
    }, []);

    const clearUpload = useCallback(() => {
        setSessionId(null);
        setUploadedFile(null);
        setError(null);
    }, []);

    return { uploading, sessionId, uploadedFile, error, uploadPDF, uploadURL, clearUpload };
}

