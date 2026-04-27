import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Search, Star, Phone, MapPin, Mail, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!user) {
      toast('Please sign in to make a reservation.', { icon: '👋' });
      navigate('/login');
      return;
    }
    
    if (!date || !time) {
      toast.error('Please select both date and time');
      return;
    }

    setIsSearching(true);
    try {
      await API.post('/reservations', {
        guests: parseInt(guests.replace('+', '')),
        date,
        time,
        notes: "Booked from landing page"
      });
      toast.success('Reservation confirmed successfully! Check email for details.');
      setDate('');
      setTime('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to make reservation');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-24 pb-16">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mt-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="relative z-10 px-6 py-20 sm:py-32 lg:px-16 flex flex-col items-center text-center">
          <span className="px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30 backdrop-blur-md mb-6 animate-fade-in">
            Elevate Your Dining Experience
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-6 max-w-4xl leading-tight">
            Book a table for an <span className="text-blue-400">unforgettable</span> evening.
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mb-10">
            Discover culinary excellence at Spice Hub. Reserve your spot today to indulge in our seasonal menus crafted by world-class chefs.
          </p>
        </div>
      </div>

      {/* Booking Form Widget */}
      <div className="max-w-5xl w-full mx-auto -mt-32 sm:-mt-40 relative z-20 px-4">
        <div className="bg-white/95 backdrop-blur-xl p-3 sm:p-5 rounded-3xl sm:rounded-full shadow-2xl border border-slate-200">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 px-4">
              
              <div className="flex-1 py-3 sm:py-0 flex flex-col justify-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1 flex items-center gap-1.5"><CalendarIcon className="h-3 w-3" /> Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="bg-transparent border-0 p-1 text-slate-800 font-medium focus:ring-0 text-md outline-none"
                />
              </div>

              <div className="flex-1 py-3 sm:py-0 sm:px-6 flex flex-col justify-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1 flex items-center gap-1.5"><Clock className="h-3 w-3" /> Time</label>
                <select 
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="bg-transparent border-0 p-1 text-slate-800 font-medium focus:ring-0 text-md outline-none cursor-pointer"
                >
                  <option value="" disabled>Select Time</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="17:30">5:30 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="18:30">6:30 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="20:00">8:00 PM</option>
                </select>
              </div>

              <div className="flex-1 py-3 sm:py-0 sm:px-6 flex flex-col justify-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1 flex items-center gap-1.5"><Users className="h-3 w-3" /> Guests</label>
                <select 
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  className="bg-transparent border-0 p-1 text-slate-800 font-medium focus:ring-0 text-md outline-none cursor-pointer"
                >
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                  <option value="9+">9+ Guests</option>
                </select>
              </div>

            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 items-center">
              <button 
                type="submit"
                disabled={isSearching}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-2xl sm:rounded-full px-8 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-70"
              >
                {isSearching ? (
                  <div className="h-6 w-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Book Table</span>
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={async () => {
                  if (!user) {
                    toast('Please sign in to join the waitlist.', { icon: '👋' });
                    navigate('/login');
                    return;
                  }
                  try {
                    await API.post('/waitlist', { guests: parseInt(guests.replace('+', '')) });
                    toast.success('Successfully joined the waitlist!');
                  } catch(e) {
                    toast.error(e.response?.data?.message || 'Failed to join waitlist');
                  }
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl sm:rounded-full px-6 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all"
                title="Walk-in today? Join the waitlist!"
              >
                Join Waitlist
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden h-[500px] shadow-xl">
          <img src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=1000" alt="Restaurant Interior" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-6">
          <h2 className="text-base font-bold text-blue-600 uppercase tracking-widest">Our Story</h2>
          <h3 className="text-4xl font-bold text-slate-900 leading-tight">Tradition meets modern culinary excellence.</h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            Since 2010, Spice Hub has been redefining local dining. Our philosophy is simple: source the finest local ingredients and prepare them with classic techniques and modern flair. 
          </p>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Whether it's an intimate dinner for two or a grand celebration, our dedicated team ensures every moment is memorable.
          </p>
          <button className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
            Discover more about us <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Menu Preview Section */}
      <div className="bg-slate-50 py-20 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-blue-600 uppercase tracking-widest mb-2">The Menu</h2>
            <h3 className="text-4xl font-bold text-slate-900">A taste of perfection</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {/* Menu Item 1 */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-4 border-dashed">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Truffle Filet Mignon</h4>
                <p className="text-slate-500 mt-2 max-w-xs">Grass-fed beef, wild mushrooms, black truffle glaze.</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">$48</span>
            </div>
            {/* Menu Item 2 */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-4 border-dashed">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Pan-Seared Scallops</h4>
                <p className="text-slate-500 mt-2 max-w-xs">Cauliflower puree, crispy prosciutto, lemon butter.</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">$36</span>
            </div>
            {/* Menu Item 3 */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-4 border-dashed">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Wild Mushroom Risotto</h4>
                <p className="text-slate-500 mt-2 max-w-xs">Arborio rice, porcini broth, aged parmesan, chives.</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">$28</span>
            </div>
            {/* Menu Item 4 */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-4 border-dashed">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Artisan Burrata</h4>
                <p className="text-slate-500 mt-2 max-w-xs">Heirloom tomatoes, basil oil, balsamic reduction.</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">$22</span>
            </div>
          </div>
          <div className="mt-12 text-center">
            <button className="btn-secondary">View Full Menu</button>
          </div>
        </div>
      </div>

      {/* Highlights or Features */}
      <div className="max-w-7xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">Premium Offerings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Exclusive Menus", desc: "Access seasonal tasting menus prepared exclusively for our members.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400" },
            { title: "Priority Waitlist", desc: "Skip the line. Become a premium member and jump to the front.", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=400" },
            { title: "Private Events", desc: "Book our VIP rooms for your special occasions & corporate events.", img: "https://images.unsplash.com/photo-1530103862676-de889dd08ce2?auto=format&fit=crop&q=80&w=400" }
          ].map((feat, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-5">
                <img src={feat.img} alt={feat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-blue-600 py-20 rounded-3xl text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Star className="h-12 w-12 text-yellow-400 fill-yellow-400 mx-auto mb-8" />
          <h3 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto mb-8">
            "The ambiance is absolutely unmatched and the attention to detail in every dish makes Spice Hub our favorite spot in the city."
          </h3>
          <p className="text-xl text-blue-200 font-medium">— Sarah Jenkins, Food Critic</p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 px-4 max-w-7xl mx-auto border-t border-slate-200 mt-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-100 rounded-full text-slate-700">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Location</h4>
            <p className="text-slate-500">123 Culinary Blvd, NY 10012</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-100 rounded-full text-slate-700">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Call Us</h4>
            <p className="text-slate-500">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-100 rounded-full text-slate-700">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Email</h4>
            <p className="text-slate-500">hello@spicehub.com</p>
          </div>
        </div>
      </div>

    </div>
  );
}
