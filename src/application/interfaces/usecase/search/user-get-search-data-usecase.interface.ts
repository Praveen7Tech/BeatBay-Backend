import { SearchResponseDTO } from "../../../dto/search/search.response.dto";

export interface IUserGetSearchDataUseCase {
  execute(query: string): Promise<SearchResponseDTO>;
}