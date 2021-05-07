import { getCategories } from './categories';
import { getAuthors } from './authors';
import { ProcessedVideo, Video, Author, Category } from '../common/interfaces';
import { ensure, setVideoResolution } from '../common/helper-functions';
export const getVideos = (): Promise<ProcessedVideo[]> => {
  return Promise.all([getCategories(), getAuthors()]).then(([categories, authors]) => {

    // Loop through all auther's videos , convert them to ProcessedVideos 
    // then concatinate it in one Array using reduce function

    const processedVideos: ProcessedVideo[] = authors.reduce((accumulator, author) => {

      // loop through every author Video to convert it correctly to ProcessedVideo
      const procVideos = author.videos && author.videos.map((authorVideo) => {
        return convertToProcessedVideo(authorVideo, author, categories)
      }) as unknown as ProcessedVideo[];

      // accumulator of the reduce function to concat all ProcessedVideos in one Array
      return (accumulator = accumulator.concat(procVideos));
    }, [] as ProcessedVideo[]);

    // the final result 
    return processedVideos;
  });
};

export const getVideo = (id: string, categories: Category[], authors: Author[]): ProcessedVideo => {
 // return Promise.resolve().then(() => {

    const author = ensure(authors.find(author => {
      return author.videos.some(vid => vid.id === +id)
    }))

    const authorVideo: Video = ensure(author.videos && author.videos.find(video => video.id === +id))
    return convertToProcessedVideo(authorVideo, author, categories)
///  })
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
