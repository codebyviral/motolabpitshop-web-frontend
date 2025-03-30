import React from "react";
import { Header, Footer } from "../components/index";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-4 flex flex-col items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-gray-600 text-lg font-medium flex items-center gap-2 mb-8"
          ></motion.div>
          <motion.div className="w-full max-w-md relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-2 bg-yellow-100 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: "100%",
                  background: ["#f59e0b", "#fbbf24", "#f59e0b"],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  background: {
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }}
              />
            </motion.div>

            {/* Speed lines for extra effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0], x: ["-100%", "100%"] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeIn",
                repeatDelay: 0.4,
              }}
              className="absolute top-0 left-0 w-4 h-2 bg-yellow-300 blur-sm"
            />
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Loader;
