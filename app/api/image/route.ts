import { NextRequest, NextResponse } from 'next/server'

const concat = (s: string): string => {
  if (!s || s.length < 4) {
      return '';
  }
  return `/${s.slice(0, 2)}/${s.slice(2, 4)}/`
}

const parseImage = (str: string): string => {
  if (!str || str.length <= 3) {
      return '';
  }
  return `https://img.momocdn.com/album${concat(str)}${str}_L.jpg`;
}

export const GET = async(request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const imageUrl = parseImage(searchParams.get('id') as string)
  const res = await fetch(imageUrl)
  const imageBuffer = await res.arrayBuffer()
  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg'
    }
  })
}
