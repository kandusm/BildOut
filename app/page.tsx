import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect to the homepage inside the marketing folder
  // This ensures the marketing layout (with header/footer) is applied
  redirect('/home')
}
