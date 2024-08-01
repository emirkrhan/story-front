import React from 'react';

const SocialShare = ({ storyLink, storyTitle }) => {
    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyLink)}`;
        window.open(facebookUrl, '_blank');
    };

    const handleTwitterShare = () => {
        const twitterText = `Şu hikayeyi beğenebilirsiniz: ${storyTitle}`;
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(storyLink)}&text=${encodeURIComponent(twitterText)}`;
        window.open(twitterUrl, '_blank');
    };

    const handleEmailShare = () => {
        const subject = encodeURIComponent(`Check out this story: ${storyTitle}`);
        const body = encodeURIComponent(`I thought you might enjoy this story: ${storyLink}`);
        const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
    };

    return (
        <div className="px-4 flex gap-2 items-center">
            <button onClick={handleFacebookShare} className="w-8 h-8 rounded-full hover:bg-gray-300"><i class="fa-brands fa-facebook-f"></i></button>
            <button onClick={handleTwitterShare} className="w-8 h-8 rounded-full hover:bg-gray-300"><i class="fa-brands fa-x-twitter"></i></button>
            <button onClick={handleEmailShare} className="w-8 h-8 rounded-full hover:bg-gray-300"><i class="fa-regular fa-envelope"></i></button>
        </div>
    );
};

export default SocialShare;
