// components/UI/HeroSlider/HeroSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import SlideMedia from './SlideMedia';
import { ImageUrl, serverUrl } from '../../../services/url';
import axios from 'axios';
import Loading from '../Loading';

const HeroSlider = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  const defaultBanner = {
    id: 'fallback',
    media: {
      type: 'image',
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&crop=center",
      altText: "Fallback banner"
    },
    title: t('WelcomeToOurStore'),
    subtitle: t('discover Our Collections'),
    // cta: t('shopNow'),
    link: "/shop",
    textPosition: "center"
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/home/banners`);
        console.log(data);        
        if (data.success && data.banners?.length > 0) {
          setSlides(data.banners);
        } else {
          setSlides([defaultBanner]);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        setSlides([defaultBanner]);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [t]);

  useEffect(() => {
    const current = slides[currentSlide];
    if (current?.media?.type !== 'video' && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides, currentSlide]);

  useEffect(() => {
    const current = slides[currentSlide];
    const isVideo = current?.media?.type === 'video';
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.warn);
    }
  }, [slides, currentSlide]);

  const getTextAlignment = (position) => {
    return {
      left: 'text-left justify-start',
      center: 'text-center justify-center',
      right: 'text-right justify-end'
    }[position] || 'text-left justify-start';
  };

  const currentSlideData = slides[currentSlide] || defaultBanner;

  const mediaInfo = {
   url: currentSlideData.media?.url?.startsWith("http")
    ? currentSlideData.media.url
    : `${ImageUrl}${currentSlideData.media.url}`, 
    type: currentSlideData.media?.type || 'image',
    altText: currentSlideData.media?.altText || currentSlideData.title,
  };

  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loading size="lg" />
        </div>
      </section>
    );
  }

  return (
    <section id="heroSlider" className="relative h-screen overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <SlideMedia
            type={mediaInfo.type}
            url={mediaInfo.url}
            altText={mediaInfo.altText}
            ref={videoRef}
            onEnded={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            onError={() => {
              setSlides([defaultBanner]);
              setCurrentSlide(0);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className={`relative z-10 h-full flex items-center ${getTextAlignment(currentSlideData.textPosition)}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative -left-20 text-3xl lg:text-6xl font-light text-white mb-4 tracking-tight leading-tight"
            >
              {currentSlideData.title}
            </motion.h1>
            <motion.p
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg lg:text-2xl text-white/90 mb-6 font-light tracking-wide"
            >
              {currentSlideData.subtitle}
            </motion.p>
            {/* <motion.div
              key={`cta-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to={currentSlideData.link || '/shop'}
                className="inline-block bg-[#f7f5f1] text-black px-6 py-3 text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg"
              >
                {currentSlideData.cta}
              </Link>
            </motion.div> */}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
      
       
      
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
              
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`hidden w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`${t('goToSlide')} ${index + 1}`}
              />
            ))}
          </div>
       
      )}
    </section>
  );
};

export default HeroSlider;
