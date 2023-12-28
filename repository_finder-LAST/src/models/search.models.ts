import mongoose, { Document, Schema } from 'mongoose';

export interface IRepo {
  
  id: Number;
  owner: {
    avatar_url: string;
    login: string;
  };
  name: string;
  description: string | null;
  stargazers_count: Number;
  url: string;
  html_url: string;
  

}

interface ISearchResult extends Document {
  query: string;
  results: IRepo[];
  timestamp: Date;
}

const repoSchema = new Schema<IRepo>({
  id: { type: Number, required: true },
  owner:{
  avatar_url: { type: String, required: true },
  login: { type: String, required: true },
  },
  name: { type: String, required: true },
  stargazers_count: { type: Number },
  description: { type: String, required: false },
  url: { type: String, required: true },
  html_url: { type: String, required: true },
});

const searchSchema = new Schema<ISearchResult>({

  query: { type: String, required: true },
  results: [repoSchema],
  timestamp: { type: Date, default: Date.now },
});

const SearchModel = mongoose.model<ISearchResult>('Repos', searchSchema);

export default SearchModel;
