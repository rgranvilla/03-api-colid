import { beforeEach, describe, expect, it} from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';


let gynsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', ()=>{
  beforeEach(async ()=>{
    gynsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gynsRepository);
  });



  it('should be able to search for gyms', async () => {
    await gynsRepository.create({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -30.0192942,
      longitude: -51.1540702,
    });
    
    await gynsRepository.create({
      title: 'Typescript Gym',
      description: null,
      phone: null,
      latitude: -30.0192942,
      longitude: -51.1540702,
    });

    const {gyms} = await sut.execute({
      query: 'Javascript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym' }),
    ]);
  });

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i<= 22; i++ ) {
      await gynsRepository.create({
        title: `Javascript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -30.0192942,
        longitude: -51.1540702,
      });
    }

    const {gyms} = await sut.execute({
      query: 'Javascript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ]);
  });
});