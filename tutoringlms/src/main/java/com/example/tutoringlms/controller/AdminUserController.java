//package com.example.tutoringlms.controller;
//
//import com.example.tutoringlms.dto.RegisterRequest;
//import com.example.tutoringlms.model.User;
//import com.example.tutoringlms.service.UserService;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//
//@Controller
//@RequestMapping("/admin")
//public class AdminUserController {
//
//    private final UserService userService;
//
//    public AdminUserController(UserService userService) {
//        this.userService = userService;
//    }
//
//    @GetMapping("/users")
//    public String listUsers(Model model) {
//        model.addAttribute("users", userService.findAllUsers());
//        return "admin/users";
//    }
//
//    @GetMapping("/add")
//    public String addUserForm(Model model) {
//        model.addAttribute("user", new RegisterRequest());
//        return "admin/add-user"; // view: templates/admin/add-user.html
//    }
//
//    @PostMapping("/add")
//    public String addUser(@ModelAttribute RegisterRequest user) {
//        userService.register(user);
//        return "redirect:/admin/users";
//    }
//
//    @GetMapping("/edit/{id}")
//    public String editUserForm(@PathVariable Long id, Model model) {
//        User user = userService.getUserById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));
//        RegisterRequest req = new RegisterRequest();
//        req.setId(user.getId());
//        req.setUsername(user.getUsername());
//        req.setEmail(user.getEmail());
//        req.setFirstName(user.getFirstName());
//        req.setLastName(user.getLastName());
//        req.setPhoneNum(user.getPhoneNum());
//        model.addAttribute("user", req);
//        return "admin/edit-user"; // view: templates/admin/edit-user.html
//    }
//
//    @PostMapping("/edit")
//    public String updateUser(@ModelAttribute RegisterRequest user) {
//        userService.updateUser(user.getId(), user);
//        return "redirect:/admin/users";
//    }
//
//    @GetMapping("/delete/{id}")
//    public String deleteUser(@PathVariable Long id) {
//        userService.deleteUserById(id);
//        return "redirect:/admin/users";
//    }
//
//    @GetMapping("/login")
//    public String loginPage() {
//        return "admin/login"; // view: templates/admin/login.html
//    }
//}
