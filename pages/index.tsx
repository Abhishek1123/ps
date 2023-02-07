import axios from 'axios';
import Head from 'next/head';
import { Video } from '../types';
import VideoItem from '../components/VideoItem';
import { MouseEvent, useEffect, useState } from 'react';
import { pauseAllVideo } from '../utils/pauseAllVideo';
import { updateActionBtn } from '../utils/updateActionBtn';
import { ROOT_URL } from '../utils';
import Layout from '../components/Layout';

interface Props {
  videos: Video[];
}

export default function Home({ videos }: Props) {
  const [isMute, setIsMute] = useState(true);

  const handleMute = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsMute((prev) => !prev);
  };

  useEffect(() => {
    const videoElems = document.querySelectorAll('.video');

    videoElems.forEach((elem) => {
      const video = elem as HTMLVideoElement;

      isMute ? (video.muted = true) : (video.muted = false);
    });
  }, [isMute]);

  useEffect(() => {
    const videoElems = document.querySelectorAll('.video');
    const elem = document.querySelector('.video-container')!;

    let CURRENT_ID = 1;
    let isScrollDown = true;
    let current = 0;

    function checkDirection() {
      const scrollH = elem.scrollTop;

      if (scrollH > current) {
        isScrollDown = true;
      } else {
        isScrollDown = false;
      }

      current = scrollH;
    }

    elem.addEventListener('scroll', checkDirection);

    const observer = new IntersectionObserver(
      (entries) => {
        // console.log({ entry: entries[0], CURRENT_ID });

        const selectedEntry = entries[0];
        const selectedVideo = selectedEntry.target as HTMLVideoElement;

        if (!isScrollDown) {
          if (+selectedVideo.id < CURRENT_ID && selectedEntry.isIntersecting) {
            CURRENT_ID = +selectedVideo.id;

            pauseAllVideo(videoElems);
            selectedVideo.play();
            updateActionBtn(selectedVideo.id);
          }
        } else {
          if (+selectedVideo.id === CURRENT_ID) {
            if (selectedEntry.isIntersecting) {
              selectedVideo.play();
              updateActionBtn(selectedVideo.id);
            } else {
              CURRENT_ID++;
              const id = CURRENT_ID.toString();
              const videoToPlay = document.getElementById(
                id
              ) as HTMLVideoElement;

              pauseAllVideo(videoElems);
              videoToPlay.play();
              updateActionBtn(id);
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    videoElems.forEach((video) => observer.observe(video));

    return () => {
      videoElems.forEach((video) => observer.unobserve(video));
      elem.removeEventListener('scroll', checkDirection);
    };
  }, []);

  return (
    <Layout>
      <Head>
        <title>TikTok - Make Your Day</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='video-container h-[calc(100vh-96px)] overflow-hidden overflow-y-auto pt-2'>
        {videos?.map((video, idx) => (
          <VideoItem
            key={video._id}
            id={idx + 1}
            video={video}
            isMute={isMute}
            handleMute={handleMute}
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { data: videos } = await axios.get(`${ROOT_URL}/api/post`);

  return { props: { videos } };
}
