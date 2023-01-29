import Head from 'next/head';
import { FaCloudUploadAlt } from 'react-icons/fa';
import SelectTopic from '../components/SelectTopic';
import { client } from '../utils/client';
import { useState } from 'react';
import { SanityAssetDocument } from '@sanity/client';
import { topics } from '../utils/constants';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface Event<T = EventTarget> {
  target: T;
}

export default function Upload() {
  const { data: user }: any = useSession();
  const router = useRouter();

  const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | null>(
    null
  );

  const [caption, setCaption] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  async function uploadFile(e: Event<HTMLInputElement>) {
    const selectedFile = e.target.files![0] as File;
    const fileTypes = ['video/mp4', 'video/webm'];

    if (selectedFile && fileTypes.includes(selectedFile.type)) {
      setIsUploading(true);

      try {
        const video = await client.assets.upload('file', selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        });

        setVideoAsset(video);
        setIsUploading(false);
      } catch (error) {
        setIsUploading(false);
        console.log(error);
      }
    }
  }

  async function handleUpload() {
    if (!caption || !selectedTopic || !videoAsset) return;

    setIsPosting(true);

    const doc = {
      _type: 'post',
      caption,
      video: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: videoAsset._id,
        },
      },
      userId: user?._id,
      postedBy: {
        _type: 'postedBy',
        _ref: user?._id,
      },
      topic: selectedTopic.name,
    };

    await client.create(doc);
    router.push('/');
    setIsPosting(false);
  }

  function handleDiscard() {
    setVideoAsset(null);
    setCaption('');
    setSelectedTopic(topics[0]);
    setIsPosting(false);
  }

  return (
    <>
      <Head>
        <title>Upload | Tik Tik</title>
      </Head>

      <div className='w-full h-[calc(100vh-96px)] overflow-hidden overflow-y-auto'>
        <div className='border shadow-sm max-w-4xl mx-auto p-6 rounded-lg mb-4 xs:mb-0 overflow-hidden'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold'>Upload video</h2>
            <p className='text-[rgba(22,24,35,0.5)]'>
              Post a video to your account
            </p>
          </div>

          <div className='flex flex-col-reverse md:flex-row items-center'>
            {/* left */}
            <label
              htmlFor='video'
              className={`${isUploading ? 'bg-gray-100' : ''} ${
                videoAsset ? 'p-0 bg-black border-none' : 'p-4'
              } flex flex-col items-center justify-center w-[260px] h-[458px] rounded-lg border-2 border-dashed border-gray-300 text-[rgba(22,24,35,0.5)] cursor-pointer hover:border-primary transition-all`}
            >
              {videoAsset ? (
                <video
                  src={videoAsset.url}
                  controls
                  loop
                  muted
                  className='video h-full w-full object-center'
                />
              ) : isUploading ? (
                <>
                  <div className='border-2 border-l-primary animate-spin w-12 h-12 rounded-full' />
                  <h3 className='mt-4 text-lg animate-pulse tracking-wide'>
                    Uploading...
                  </h3>
                </>
              ) : (
                <>
                  <div className='flex justify-center text-gray-300'>
                    <FaCloudUploadAlt size={45} />
                  </div>
                  <h3 className='font-semibold text-lg mb-6 text-black'>
                    Select video to upload
                  </h3>
                  <p className='mb-2 text-sm'>MP4 or WebM</p>
                  <p className='mb-2 text-sm'>720x1280 resolution or higher</p>
                  <p className='mb-2 text-sm'>Up to 30 minutes</p>
                  <p className='mb-6 text-sm'>Less than 2 GB</p>
                  <p className='btn-primary w-4/5 py-2 text-center'>
                    Select file
                  </p>
                  <input
                    id='video'
                    type='file'
                    accept='video/mp4, video/webm'
                    className='w-0 h-0'
                    onChange={uploadFile}
                  />
                </>
              )}
            </label>

            {/* right */}
            <div className='flex-1 md:pl-8 w-full mb-10 md:mb-0'>
              <label htmlFor='caption' className='block mb-2 font-semibold'>
                Caption
              </label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                type='text'
                id='caption'
                className='block shadow-md outline-none w-full rounded-lg py-3 px-3'
              />

              <p className='mb-2 mt-6 font-semibold'>Choose a topic</p>
              <SelectTopic
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
              />

              <div className='mt-12 hidden md:flex items-center justify-center gap-4'>
                <button
                  onClick={handleDiscard}
                  className='btn-secondary py-2 w-36'
                >
                  Discard
                </button>

                <button
                  onClick={handleUpload}
                  className='btn-primary py-2 w-36 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border disabled:border-gray-200'
                  disabled={!caption || !selectedTopic || !videoAsset}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>

          {/* mobile layout */}
          <div className='mt-12 flex md:hidden items-center justify-center gap-4'>
            <button onClick={handleDiscard} className='btn-secondary py-2 w-36'>
              Discard
            </button>

            <button
              onClick={handleUpload}
              className='btn-primary py-2 w-36 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border disabled:border-gray-200'
              disabled={!caption || !selectedTopic || !videoAsset}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}