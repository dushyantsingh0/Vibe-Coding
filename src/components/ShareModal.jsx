import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import CreativeCard from './CreativeCard';
import LoadingSpinner from './LoadingSpinner';
import './ShareModal.css';

export default function ShareModal({ isOpen, onClose, post }) {
    const cardRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen || !post) return null;

    const handleDownload = async () => {
        if (cardRef.current === null) {
            return;
        }

        setIsGenerating(true);
        try {
            // We need to ensure fonts are loaded and everything is ready
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2, // High quality
                style: {
                    transform: 'scale(1)', // Reset any scaling for the capture
                    transformOrigin: 'top left'
                }
            });

            const link = document.createElement('a');
            link.download = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_share.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image', err);
            alert('Failed to generate image. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        if (cardRef.current === null) return;

        setIsGenerating(true);
        try {
            const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'share.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: post.title,
                    text: `Check out this post by ${post.authorName} on DevPulse!`,
                    files: [file]
                });
            } else {
                // Fallback to download if native share not supported
                handleDownload();
            }
        } catch (err) {
            console.error('Error sharing:', err);
            // Fallback to download
            handleDownload();
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="share-modal-overlay" onClick={onClose}>
            <div className="share-modal-content" onClick={e => e.stopPropagation()}>
                <div className="share-modal-header">
                    <h2>Share this story</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="share-preview-container">
                    {/* This is the actual element we will capture */}
                    <div className="creative-card-scale-wrapper">
                        <CreativeCard ref={cardRef} post={post} />
                    </div>
                </div>

                <div className="share-actions">
                    <button
                        className="share-action-btn download-btn"
                        onClick={handleDownload}
                        disabled={isGenerating}
                    >
                        {isGenerating ? <LoadingSpinner size="small" color="white" /> : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download Image
                            </>
                        )}
                    </button>

                    <button
                        className="share-action-btn share-native-btn"
                        onClick={handleShare}
                        disabled={isGenerating}
                    >
                        {isGenerating ? <LoadingSpinner size="small" color="white" /> : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                                Share
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
