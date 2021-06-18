export interface Course {
  id?: number;
  cname?: string;
  cTime?: string;
  cnum?: string; //课程学生人数
}

export interface User {
  id?: number;
  name?: string;
  phone?: string;
  password?: string;
  role?: number;
  courses?: Course[];
}

export interface laboratory {
  id?: number;
  classnum?: number;
  mnum?: number;
  message: string;
  check: number;
}
