import { getCategories } from './categories';
import { getAuthors } from './authors';
import { ProcessedVideo, Video, Author, Category } from '../common/interfaces';
import { ensure, setVideoResolution } from '../common/helper-functions';
export const getVideos = (): Promise<ProcessedVideo[]> => {
  return Promise.all([getCategories(), getAuthors()]).then(([categories, authors]) => {
    // TODO: implement

    // Loop through all auther's videos , convert them to ProcessedVideos 
    // then concatinate it in one Array using reduce function

    const processedVideos: ProcessedVideo[] = authors.reduce((accumulator, author) => {
      const authorVideos = author.videos;

      const procVideos = authorVideos as unknown as ProcessedVideo[];

      // loop through every author Video to convert it correctly to ProcessedVideo
       authorVideos.map((authorVideo) => {
        const procVideo: ProcessedVideo = convertToProcessedVideo(authorVideo, author, categories)
        return procVideo;
      });
      // accumulator of the reduce function to concat all ProcessedVideos in one Array
      // the second argument of js reduce function
      return (accumulator = accumulator.concat(procVideos));
    }, [] as ProcessedVideo[]);
    return processedVideos;
  });
};

export const getVideo = (id: string, categories: Category[], authors: Author[]): Promise<ProcessedVideo> => {
  return Promise.resolve().then(() => {

    const author = ensure(authors.find(author => {
      const videos = author.videos
      return videos.some(vid => vid.id === +id)
    }))

    const authorVideo: Video = ensure(author.videos.find(video => video.id === +id))
    const procVideo: ProcessedVideo = convertToProcessedVideo(authorVideo, author, categories)
    return procVideo
  })
}

const convertToProcessedVideo = (video: Video, author: Author, allCategories: Category[]): ProcessedVideo => {

  const procVideo = video as unknown as ProcessedVideo;
  procVideo.author = author.name;
  const ProcessVideoCategories = video.catIds.map(
    (catId) => ensure(allCategories.find((category) => category.id === catId)).name
  );
  procVideo.categories = ProcessVideoCategories;
  procVideo.format = setVideoResolution('one')
  procVideo.realeaseDate = new Date()
  return procVideo

}
