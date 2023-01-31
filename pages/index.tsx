import axios from 'axios';
import Head from 'next/head';
import { Video } from '../types';
import VideoItem from '../components/VideoItem';
import { MouseEvent, useEffect, useState } from 'react';
import { pauseAllVideo } from '../utils/pauseAllVideo';
import { updateActionBtn } from '../utils/updateActionBtn';

interface Props {
  videos: Video[];
}

export default function Home({ videos }: Props) {
  const [isMute, setIsMute] = useState(true);

  const handleMute = (e: MouseEvent) => {
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

    let CURRENT_ID = 1;

    const observer = new IntersectionObserver(
      (entries) => {
        const selectedEntry = entries[0];
        const selectedVideo = selectedEntry.target as HTMLVideoElement;

        if (+selectedVideo.id === CURRENT_ID) {
          if (selectedEntry.isIntersecting) {
            const id = CURRENT_ID.toString();
            const currentVideo = document.getElementById(
              id
            ) as HTMLVideoElement;

            currentVideo.play();
            updateActionBtn(id);
          } else {
            pauseAllVideo(videoElems);

            CURRENT_ID++;
            const id = CURRENT_ID.toString();
            const videoToPlay = document.getElementById(id) as HTMLVideoElement;
            videoToPlay.play();
            updateActionBtn(id);
          }
        } else if (+selectedVideo.id < CURRENT_ID) {
          pauseAllVideo(videoElems);

          CURRENT_ID--;
          const id = CURRENT_ID.toString();
          const videoToPlay = document.getElementById(id) as HTMLVideoElement;
          videoToPlay.play();
          updateActionBtn(id);
        }
      },
      { threshold: 0.5 }
    );

    videoElems.forEach((video) => observer.observe(video));

    return () => videoElems.forEach((video) => observer.unobserve(video));
  }, []);

  return (
    <>
      <Head>
        <title>TikTok</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='h-[calc(100vh-96px)] overflow-hidden overflow-y-auto pt-2'>
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
    </>
  );
}

export async function getServerSideProps() {
  const { data: videos } = await axios.get('http://localhost:3000/api/post');

  return { props: { videos } };
}
