import Link from 'next/link'
import { Check, X } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">Pricing</h2>
          <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Pricing that scales with you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-600 sm:text-xl/8">
          Choose an affordable plan that is packed with the best features for collecting and managing data.
        </p>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
          {/* FREE PLAN */}
          <div className="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg/8 font-semibold text-gray-900">Startup (Free)</h3>
              <p className="mt-4 text-sm/6 text-gray-600">Perfect for individuals trying out the platform.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-semibold tracking-tight text-gray-900">$0</span>
                <span className="text-sm/6 font-semibold text-gray-600">/month</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-600">
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> 3 Active Forms</li>
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> 100 Submissions / month</li>
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> 5 Basic Templates</li>
                <li className="flex gap-x-3 text-gray-400"><X className="h-6 w-5 flex-none" /> Advanced Branding</li>
                <li className="flex gap-x-3 text-gray-400"><X className="h-6 w-5 flex-none" /> Remove Watermark</li>
              </ul>
            </div>
            <Link href="/signup" aria-describedby="tier-free" className="mt-8 block rounded-md px-3 py-2 text-center text-sm/6 font-semibold ring-1 ring-inset ring-indigo-200 text-indigo-600 hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Get started for free
            </Link>
          </div>

          {/* PRO PLAN */}
          <div className="rounded-3xl p-8 ring-2 ring-indigo-600 xl:p-10 bg-white shadow-xl relative flex flex-col justify-between">
            <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs/5 font-semibold text-white">Most popular</div>
            <div>
              <h3 className="text-lg/8 font-semibold text-indigo-600">Professional</h3>
              <p className="mt-4 text-sm/6 text-gray-600">Everything you need to grow your business and collect leads.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-semibold tracking-tight text-gray-900">$15</span>
                <span className="text-sm/6 font-semibold text-gray-600">/month</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-600">
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> <span className="font-bold text-gray-900">Unlimited</span> Active Forms</li>
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> 2,500 Submissions / month</li>
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> <span className="font-bold text-gray-900">All 60 Elite Templates</span></li>
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> Custom Themes & Branding</li>
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> Remove Watermark</li>
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> CSV Data Exports</li>
              </ul>
            </div>
            <Link href="/signup?plan=pro" aria-describedby="tier-pro" className="mt-8 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Start Free Trial
            </Link>
          </div>

          {/* AGENCY PLAN */}
          <div className="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg/8 font-semibold text-gray-900">Agency</h3>
              <p className="mt-4 text-sm/6 text-gray-600">For high-volume businesses and dedicated agencies.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-semibold tracking-tight text-gray-900">$49</span>
                <span className="text-sm/6 font-semibold text-gray-600">/month</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-600">
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> Everything in Professional</li>
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> <span className="font-bold text-gray-900">Unlimited</span> Submissions</li>
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> Custom Domain Support (Coming soon)</li>
                <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-indigo-600" /> Priority Email Support</li>
              </ul>
            </div>
            <Link href="/signup?plan=agency" aria-describedby="tier-agency" className="mt-8 block rounded-md px-3 py-2 text-center text-sm/6 font-semibold ring-1 ring-inset ring-indigo-200 text-indigo-600 hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Upgrade to Agency
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
